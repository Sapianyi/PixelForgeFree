import { ImageConverter } from "../core/converters/ImageConverter";
import { VideoConverter } from "../core/converters/VideoConverter";
import { PdfConverter } from "../core/converters/PdfConverter";
import { DocumentConverter } from "../core/converters/DocumentConverter";

const imageConverter = new ImageConverter();
const videoConverter = new VideoConverter();
const pdfConverter = new PdfConverter();
const documentConverter = new DocumentConverter();

self.addEventListener("message", async (e: MessageEvent) => {
  const { command, jobId, jobType, fileHandle, targetFormat, options } = e.data;

  if (command === "START_CONVERSION") {
    try {
      let filesList: File[] = [];

      // Пункт 4: Легальна обробка поштучних та пакетних тасок (масивів)
      if (Array.isArray(fileHandle)) {
        for (const handle of fileHandle) {
          filesList.push(await handle.getFile());
        }
      } else if (fileHandle) {
        filesList.push(await fileHandle.getFile());
      }

      const primaryFile = filesList[0];

      if (jobType === "document") {
        // Передаємо чистий масив скомпільованих файлів без порушення типів
        const resultBlob = await documentConverter.convert(
          { id: jobId, file: primaryFile, targetFormat, options },
          (progress) => self.postMessage({ type: "PROGRESS", jobId, progress }),
          filesList, // Передаємо третім параметром або всередині об'єкта завдання
        );
        self.postMessage({ type: "SUCCESS", jobId, result: resultBlob });
      } else if (jobType === "pdf") {
        const resultBlob = await pdfConverter.convert(
          { id: jobId, file: primaryFile, targetFormat, options },
          (progress) => self.postMessage({ type: "PROGRESS", jobId, progress }),
        );
        self.postMessage({ type: "SUCCESS", jobId, result: resultBlob });
      } else if (jobType === "image") {
        const resultBlob = await imageConverter.convert(
          { id: jobId, file: primaryFile, targetFormat, options },
          (progress) => self.postMessage({ type: "PROGRESS", jobId, progress }),
        );
        self.postMessage({ type: "SUCCESS", jobId, result: resultBlob });
      } else if (jobType === "video" || jobType === "audio") {
        const resultBlob = await videoConverter.convert(
          { id: jobId, file: primaryFile, targetFormat, options },
          (progress) => self.postMessage({ type: "PROGRESS", jobId, progress }),
        );
        self.postMessage({ type: "SUCCESS", jobId, result: resultBlob });
      }
    } catch (err: any) {
      console.error("[Worker Critical Error Detail]:", err);
      self.postMessage({
        type: "ERROR",
        jobId,
        error:
          err.stack || err.message || "Detailed crash logs printed to console.",
      });
    }
  }
});
