import { BaseConverter, type ConversionJob } from "./BaseConverter";
// Імпортуємо jsPDF у воркер-сумісному режимі
import { jsPDF } from "jspdf";

export class DocumentConverter extends BaseConverter {
  async loadEngine(): Promise<void> {
    this.isLoaded = true;
  }

  async convert(
    job: ConversionJob,
    onProgress: (progress: number) => void,
    filesList?: File[], // Масив легалізовано!
  ): Promise<Blob> {
    await this.ensureEngineLoaded(); //
    onProgress(10); //

    const filesArray = filesList || [job.file]; //
    const totalFiles = filesArray.length;

    console.log(
      `[DocumentConverter] Starting layout synthesis for ${totalFiles} file(s)...`,
    );

    // Ініціалізуємо чистий PDF документ (одиниця виміру — точки/points)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
    });

    const progressSpread = 80 / totalFiles;

    for (let i = 0; i < totalFiles; i++) {
      const currentFile = filesArray[i];
      console.log(
        `[DocumentConverter] Embedding page ${i + 1}/${totalFiles}: ${currentFile.name}`,
      );

      // Зчитуємо зображення у швидкий бітмап в RAM воркера
      const imageBitmap = await createImageBitmap(currentFile);

      const width = imageBitmap.width;
      const height = imageBitmap.height;

      // Малюємо бітмап на тимчасовий OffscreenCanvas, щоб витягнути чистий JPEG/PNG буфер для PDF
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx)
        throw new Error("OffscreenCanvas context failed inside Document core");
      ctx.drawImage(imageBitmap, 0, 0);

      // Конвертуємо в JPEG для максимального стиснення всередині PDF макету
      const imgBlob = await canvas.convertToBlob({
        type: "image/jpeg",
        quality: 0.85,
      });
      const arrayBuffer = await imgBlob.arrayBuffer();
      const u8Array = new Uint8Array(arrayBuffer);

      // Якщо це не перша сторінка — додаємо новий лист у PDF
      if (i > 0) {
        doc.addPage([width, height], width > height ? "landscape" : "portrait");
      } else {
        // Для першої сторінки підганяємо початковий розмір під першу картинку
        doc.deletePage(1);
        doc.addPage([width, height], width > height ? "landscape" : "portrait");
      }

      // Вбудовуємо стиснуті байти картинки безпосередньо у векторне дерево сторінки PDF
      doc.addImage(u8Array, "JPEG", 0, 0, width, height, undefined, "FAST");

      imageBitmap.close();
      onProgress(Math.round(10 + (i + 1) * progressSpread));
    }

    onProgress(95);
    console.log(
      `[DocumentConverter] Finalizing PDF binary stream allocation...`,
    );

    // Генеруємо сирий ArrayBuffer готового документа
    const pdfOutput = doc.output("arraybuffer");
    onProgress(100);

    return new Blob([pdfOutput], { type: "application/pdf" });
  }
}
