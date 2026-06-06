import { BaseConverter, type ConversionJob } from "./BaseConverter";

export class VideoConverter extends BaseConverter {
  private coreFactory: any = null;

  async loadEngine(): Promise<void> {
    if (this.isLoaded) return;

    console.log(`[VideoConverter] Pre-loading Single-Thread WASM Factory...`);

    return new Promise((resolve, reject) => {
      const baseURL = window.location.origin;

      if ((window as any).createFFmpegCore) {
        this.coreFactory = (window as any).createFFmpegCore;
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `${baseURL}/wasm/ffmpeg-core.js`;
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        console.log(`[VideoConverter] ST-Core script attached smoothly.`);
        this.coreFactory = (window as any).createFFmpegCore;

        if (!this.coreFactory) {
          reject(new Error("FFmpeg Core factory missing in window."));
          return;
        }

        this.isLoaded = true;
        resolve();
      };

      script.onerror = () => reject(new Error("Failed to load ffmpeg-core.js"));
      document.head.appendChild(script);
    });
  }

  async convert(
    job: ConversionJob,
    onProgress: (progress: number) => void,
  ): Promise<Blob> {
    await this.ensureEngineLoaded();
    if (!this.coreFactory) throw new Error("WASM Factory not mounted");

    const { file, targetFormat } = job;
    const inputExt = file.name.split(".").pop() || "mp4";
    const inputName = `input_${job.id}.${inputExt}`;

    // Для максимальної сумісності з C++ ядром пишемо в сирий аудіо-формат adts
    const outputName = `output_${job.id}.adts`;

    // Аргументи для Емуляції ручного запуску:
    // Першим елементом ОБОВ'ЯЗКОВО має йти "ffmpeg", бо ми викликаємо метод .run() вручну!
    let args = [
      "ffmpeg",
      "-i",
      inputName,
      "-vn",
      "-c:a",
      "copy",
      "-f",
      "adts",
      "-y",
      outputName,
    ];

    console.log(`[WASM Kernel] Sync CLI arguments allocation:`, args);
    onProgress(30);

    const baseURL = window.location.origin;
    const arrayBuffer = await file.arrayBuffer();
    const u8Array = new Uint8Array(arrayBuffer);

    console.log(`[VideoConverter] Launching synchronous execution bridge...`);

    // 1. Ініціалізуємо чистий модуль у режимі очікування (noInitialRun)
    const instance = await this.coreFactory({
      noInitialRun: true,
      mainScriptUrlOrBlob: `${baseURL}/wasm/ffmpeg-core.js`,
      locateFile: (path: string) => {
        if (path.endsWith(".wasm")) return `${baseURL}/wasm/ffmpeg-core.wasm`;
        return path;
      },
      print: (text: string) => console.log(`[FFmpeg stdout] ${text}`),
      printErr: (text: string) => console.warn(`[FFmpeg stderr] ${text}`),
    });

    // 2. Вручну записуємо файл у файлову систему, яка ГАРАНТОВАНО відкрита
    console.log(`[WASM FS] Mounting raw input bytes into MEMFS slot...`);
    instance.FS.writeFile(inputName, u8Array);

    // 3. Синхронно викликаємо бінарник
    console.log(`[WASM Kernel] Invoking instance.run()...`);
    onProgress(50);

    try {
      instance.run(args);
    } catch (e) {
      // Emscripten викидає exit-код як Exception — це штатна поведінка завершення C++ main()
      console.log(
        "[WASM Kernel] Execution loop broken via native exit signal.",
        e,
      );
    }

    onProgress(85);

    // 4. МИТТЄВО зчитуємо результат, поки контекст пам'яті живий і перебуває в нашому скоупі!
    try {
      const fileStat = instance.FS.stat(outputName);
      console.log(
        `[WASM FS] Intercepted compiled bytes! Size: ${fileStat.size} bytes`,
      );

      const outputData: Uint8Array = instance.FS.readFile(outputName);

      // Чистимо віртуальний диск
      instance.FS.unlink(inputName);
      instance.FS.unlink(outputName);

      const cleanBuffer = new ArrayBuffer(outputData.byteLength);
      new Uint8Array(cleanBuffer).set(outputData);

      const mimeType =
        targetFormat === "mp3" ? "audio/mpeg" : `video/${targetFormat}`;
      onProgress(100);

      return new Blob([cleanBuffer], { type: mimeType });
    } catch (fsErr) {
      // Якщо впало — чистимо хоча б вхідний файл
      try {
        instance.FS.unlink(inputName);
      } catch (e) {}
      throw new Error(
        `[MEMFS Synchronous Critical]: Output file [${outputName}] could not be traced in active RAM scope. Ensure code features matches core.`,
      );
    }
  }
}
