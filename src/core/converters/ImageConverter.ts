import { BaseConverter, type ConversionJob } from "./BaseConverter";

export class ImageConverter extends BaseConverter {
  async loadEngine(): Promise<void> {
    this.isLoaded = true;
  }

  async convert(
    job: ConversionJob,
    onProgress: (progress: number) => void,
  ): Promise<Blob> {
    await this.ensureEngineLoaded();
    onProgress(10);

    const { file, targetFormat, options } = job;

    onProgress(30);
    const imageBitmap = await createImageBitmap(file);
    onProgress(50);

    let targetWidth = imageBitmap.width;
    let targetHeight = imageBitmap.height;

    if (options.width && options.width < imageBitmap.width) {
      targetWidth = options.width;
      const aspectRatio = imageBitmap.height / imageBitmap.width;
      targetHeight = Math.round(targetWidth * aspectRatio);
      console.log(
        `[ImageConverter] Resizing asset down to: ${targetWidth}x${targetHeight}`,
      );
    }

    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get 2D context from OffscreenCanvas");
    }

    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    onProgress(70);

    let mimeType = "image/webp";
    if (targetFormat === "png") mimeType = "image/png";
    if (targetFormat === "jpg" || targetFormat === "jpeg")
      mimeType = "image/jpeg";

    const quality =
      options.quality !== undefined ? options.quality / 100 : 0.85;

    const resultBlob = await canvas.convertToBlob({
      type: mimeType,
      quality: mimeType === "image/png" ? undefined : quality,
    });

    imageBitmap.close();
    onProgress(100);
    return resultBlob;
  }
}
