import { BaseConverter, type ConversionJob } from "./BaseConverter";
// @ts-ignore
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import { Document, Paragraph, TextRun, Packer } from "docx";
// @ts-ignore
import { zipSync } from "fflate";

export class PdfConverter extends BaseConverter {
  private pdfjs: any = null;

  async loadEngine(): Promise<void> {
    if (this.isLoaded) return;
    const module = await import("pdfjs-dist");
    this.pdfjs = module;
    this.pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    this.isLoaded = true;
  }

  async convert(
    job: ConversionJob,
    onProgress: (progress: number) => void,
  ): Promise<Blob> {
    await this.ensureEngineLoaded();
    onProgress(5);

    const { file, targetFormat, options } = job;
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = this.pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    // ─── 📚 ГІЛКА PDF TO SPRAVZHNIY EPUB CONTAINER (Пункт 3) ───
    if (targetFormat === "epub") {
      console.log(
        `[PdfConverter] Generating valid binary OEBPS container stream...`,
      );

      // Базова HTML-текстовка глав книги
      let textChapters: { name: string; html: string }[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        let chapterHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Chapter ${pageNum}</title>
  <style>body { font-family: serif; padding: 1em; line-height: 1.5; }</style>
</head>
<body>
  <h2>Page ${pageNum}</h2>
`;

        const items = textContent.items.sort((a: any, b: any) => {
          if (Math.abs(a.transform[5] - b.transform[5]) < 5)
            return a.transform[4] - b.transform[4];
          return b.transform[5] - a.transform[5];
        });

        let currentLineY: number | null = null;
        let lineText = "";

        items.forEach((item: any) => {
          const y = item.transform[5];
          if (currentLineY === null || Math.abs(y - currentLineY) > 5) {
            if (lineText.trim().length > 0)
              chapterHtml += `  <p>${lineText.trim()}</p>\n`;
            currentLineY = y;
            lineText = item.str;
          } else {
            lineText += " " + item.str;
          }
        });

        if (lineText.trim().length > 0)
          chapterHtml += `  <p>${lineText.trim()}</p>\n`;
        chapterHtml += `</body>\n</html>`;

        textChapters.push({
          name: `chapter_${pageNum}.xhtml`,
          html: chapterHtml,
        });

        // Пункт 5: Точний математичний прогрес посторінково
        onProgress(Math.round(5 + (pageNum / numPages) * 80));
      }

      // Зшиваємо офіційну бінарну структуру EPUB контейнера
      const encoder = new TextEncoder();
      const zipStructure: Record<string, any> = {};

      // Файл mimetype має йти першим БЕЗ стиснення за специфікацією IDPF
      zipStructure["mimetype"] = [
        encoder.encode("application/epub+zip"),
        { level: 0 },
      ];

      // Мета-інфраструктура книги
      zipStructure["META-INF/container.xml"] =
        encoder.encode(`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

      // Створюємо маніфест контенту content.opf
      let opfManifest = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${file.name.replace(/\.pdf$/i, "")}</dc:title>
    <dc:identifier id="bookid">urn:uuid:${Math.random().toString(36).substring(5)}</dc:identifier>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
`;
      let opfSpine = `  <spine toc="ncx">\n`;

      textChapters.forEach((ch, idx) => {
        opfManifest += `    <item id="ch_${idx}" href="${ch.name}" media-type="application/xhtml+xml"/>\n`;
        opfSpine += `    <itemref idref="ch_${idx}"/>\n`;
      });

      opfManifest += `  </manifest>\n` + opfSpine + `  </spine>\n</package>`;
      zipStructure["OEBPS/content.opf"] = encoder.encode(opfManifest);

      // Навігаційна карта toc.ncx
      let ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <navMap>
`;
      textChapters.forEach((ch, idx) => {
        ncx += `    <navPoint id="np_${idx}" playOrder="${idx + 1}"><navLabel><text>Page ${idx + 1}</text></navLabel><content src="${ch.name}"/></navPoint>\n`;
      });
      ncx += `  </navMap>\n</ncx>`;
      zipStructure["OEBPS/toc.ncx"] = encoder.encode(ncx);

      // Додаємо глави в архів OEBPS папки
      textChapters.forEach((ch) => {
        zipStructure[`OEBPS/${ch.name}`] = encoder.encode(ch.html);
      });

      console.log(
        `[PdfConverter] Zipping multi-component epub container stream via fflate...`,
      );
      onProgress(95);

      const zippedBuffer = zipSync(zipStructure);
      onProgress(100);
      return new Blob([zippedBuffer], { type: "application/epub+zip" });
    }

    // ─── 📊 ГІЛКА PDF TO WORD (DOCX) — З ТОЧНИМ ПРОГРЕСОМ (Пункт 5) ───
    if (targetFormat === "docx") {
      const docParagraphs: Paragraph[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        let currentLineY: number | null = null;
        let lineText = "";

        const items = textContent.items.sort((a: any, b: any) => {
          if (Math.abs(a.transform[5] - b.transform[5]) < 5)
            return a.transform[4] - b.transform[4];
          return b.transform[5] - a.transform[5];
        });

        items.forEach((item: any) => {
          const y = item.transform[5];
          if (currentLineY === null || Math.abs(y - currentLineY) > 5) {
            if (lineText.trim().length > 0) {
              docParagraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: lineText, font: "Calibri", size: 24 }),
                  ],
                }),
              );
            }
            currentLineY = y;
            lineText = item.str;
          } else {
            lineText += " " + item.str;
          }
        });

        if (lineText.trim().length > 0) {
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: lineText, font: "Calibri", size: 24 }),
              ],
            }),
          );
        }

        if (pageNum < numPages) {
          docParagraphs.push(
            new Paragraph({ text: "", pageBreakBefore: true }),
          );
        }

        // Математичний прогрес для Word
        onProgress(Math.round(5 + (pageNum / numPages) * 85));
      }

      const wordDoc = new Document({
        sections: [{ properties: {}, children: docParagraphs }],
      });
      const resultBlob = await Packer.toBlob(wordDoc);
      onProgress(100);
      return new Blob([resultBlob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
    }

    // ─── 🖼️ СТАНДАРТНА ГІЛКА PDF TO IMAGE (PNG/JPG) ───
    const scale = options.scale !== undefined ? options.scale : 2.0;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: scale });

    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error("Failed to get 2D context from PDF OffscreenCanvas");

    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    onProgress(90);

    let mimeType = "image/png";
    if (targetFormat === "jpg" || targetFormat === "jpeg")
      mimeType = "image/jpeg";
    if (targetFormat === "webp") mimeType = "image/webp";

    const resultBlob = await canvas.convertToBlob({ type: mimeType });
    onProgress(100);
    return resultBlob;
  }
}
