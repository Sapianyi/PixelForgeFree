export interface ConversionJob {
  id: string;
  file: File;
  targetFormat: string;
  options: Record<string, any>;
}

export abstract class BaseConverter {
  protected isLoaded = false;

  /**
   * Логіка лінивого завантаження WASM-бінарників або зовнішніх скриптів.
   * Викликається лише при першій спробі конвертації цього типу файлів.
   */
  abstract loadEngine(): Promise<void>;

  /**
   * Головний метод конвертації, який повертає готовий Blob
   */
  abstract convert(
    job: ConversionJob,
    onProgress: (progress: number) => void,
  ): Promise<Blob>;

  /**
   * Гарантує, що двіжок завантажений перед початком роботи
   */
  protected async ensureEngineLoaded(): Promise<void> {
    if (!this.isLoaded) {
      console.log(`[Engine] Initializing ${this.constructor.name}...`);
      await this.loadEngine();
      this.isLoaded = true;
      console.log(`[Engine] ${this.constructor.name} ready.`);
    }
  }
}
