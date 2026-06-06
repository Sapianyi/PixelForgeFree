export class OPFSStorage {
  private static instance: OPFSStorage;
  private root: FileSystemDirectoryHandle | null = null;

  private constructor() {}

  /**
   * Отримання синглтону та ініціалізація доступу до OPFS root
   */
  public static getInstance(): OPFSStorage {
    if (!OPFSStorage.instance) {
      OPFSStorage.instance = new OPFSStorage();
    }
    return OPFSStorage.instance;
  }

  /**
   * Гарантує, що коренева директорія OPFS доступна
   */
  private async ensureRoot(): Promise<FileSystemDirectoryHandle> {
    if (!this.root) {
      this.root = await navigator.storage.getDirectory();
    }
    return this.root;
  }

  /**
   * Зберігає звичайний File або Blob в OPFS через швидкий Writable Stream
   * @param id Унікальний ідентифікатор таски (jobId)
   * @param file Об'єкт файлу з інтерфейсу
   * @returns Повертає FileSystemFileHandle для передачі у воркери
   */
  public async writeInboundFile(
    id: string,
    file: File,
  ): Promise<FileSystemFileHandle> {
    const root = await this.ensureRoot();

    // Створюємо або перезаписуємо файл у віртуальній ФС
    const fileHandle = await root.getFileHandle(`input_${id}_${file.name}`, {
      create: true,
    });

    // Створюємо потік для запису
    const writable = await fileHandle.createWritable();

    // Якщо файл великий, браузер автоматично оптимізує запис на диск шматками
    await writable.write(file);
    await writable.close();

    console.log(
      `[OPFS] Cached inbound file securely: input_${id}_${file.name}`,
    );
    return fileHandle;
  }

  /**
   * Читає файл з OPFS у вигляді звичайного Blob для скачування користувачем
   */
  public async readOutboundBlob(filename: string): Promise<Blob> {
    const root = await this.ensureRoot();
    const fileHandle = await root.getFileHandle(filename);
    const file = await fileHandle.getFile();
    return file;
  }

  /**
   * Видаляє конкретний файл з OPFS, щоб звільнити місце на диску ПК
   */
  public async deleteFile(filename: string): Promise<void> {
    try {
      const root = await this.ensureRoot();
      await root.removeEntry(filename);
      console.log(`[OPFS] Cleaned up temporary asset: ${filename}`);
    } catch (error) {
      console.error(`[OPFS] Error deleting file ${filename}:`, error);
    }
  }

  /**
   * Повне очищення нашого віртуального диска (викликається при старті або скиданні)
   */
  public async clearAllStorage(): Promise<void> {
    const root = await this.ensureRoot();
    // @ts-ignore (ітератори для OPFS підтримуються сучасними браузерами, але TS може сваритися без esnext)
    for await (const name of root.keys()) {
      await root.removeEntry(name);
    }
    console.log("[OPFS] Storage fully sanitized.");
  }
}
