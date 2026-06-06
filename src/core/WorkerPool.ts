export interface PoolJob {
  id: string;
  type: "image" | "video" | "audio" | "pdf" | "document" | "ebook";
  fileHandle: FileSystemFileHandle | FileSystemFileHandle[]; // Пункт 4: Легалізація масивів
  targetFormat: string;
  options: Record<string, any>;
  onProgress: (progress: number) => void;
  onSuccess: (resultBlob: Blob) => void;
  onError: (error: Error) => void;
}

interface WorkerInstance {
  id: number;
  worker: Worker;
  activeJobId: string | null;
}

export class WorkerPool {
  private static instance: WorkerPool | null = null;
  private workers: WorkerInstance[] = [];
  private queue: PoolJob[] = [];
  private maxWorkers: number;

  private constructor() {
    // Визначаємо ліміт потоків на основі ядер процесора ПК
    this.maxWorkers = Math.min(navigator.hardwareConcurrency || 4, 4);
  }

  public static getInstance(): WorkerPool {
    if (!WorkerPool.instance) {
      WorkerPool.instance = new WorkerPool();
    }
    return WorkerPool.instance;
  }

  public enqueue(job: PoolJob): void {
    this.queue.push(job);
    this.dispatch();
  }

  // Пункт 8: Метод термінації конкретної таски за запитом користувача
  public cancelJob(jobId: string): void {
    // 1. Якщо таска ще в черзі — просто зрізаємо її
    const queueIndex = this.queue.findIndex((j) => j.id === jobId);
    if (queueIndex !== -1) {
      const [cancelledJob] = this.queue.splice(queueIndex, 1);
      cancelledJob.onError(new Error("Job cancelled by operator."));
      return;
    }

    // 2. Якщо таска вже крутиться в потоці — вбиваємо воркер і перезапускаємо його інстанс
    const workerInstance = this.workers.find((w) => w.activeJobId === jobId);
    if (workerInstance) {
      console.log(
        `[WorkerPool] Hard terminating thread #${workerInstance.id} due to cancel request...`,
      );
      workerInstance.worker.terminate();

      // Створюємо чистий новий потік на заміну вбитому
      workerInstance.worker = new Worker(
        new URL("../workers/pipeline.worker.ts", import.meta.url),
        { type: "module" },
      );
      workerInstance.activeJobId = null;

      this.dispatch();
    }
  }

  private dispatch(): void {
    if (this.queue.length === 0) return;

    // Шукаємо вільний потік
    let workerInstance = this.workers.find((w) => w.activeJobId === null);

    // Якщо вільного потоку немає, але ліміт не вичерпано — спавнимо новий
    if (!workerInstance && this.workers.length < this.maxWorkers) {
      const id = this.workers.length + 1;
      console.log(`[WorkerPool] Spawned thread #${id}`);
      const worker = new Worker(
        new URL("../workers/pipeline.worker.ts", import.meta.url),
        { type: "module" },
      );
      workerInstance = { id, worker, activeJobId: null };
      this.workers.push(workerInstance);
    }

    if (!workerInstance) return;

    const job = this.queue.shift();
    if (!job) return;

    workerInstance.activeJobId = job.id;
    console.log(
      `[WorkerPool] Dispatching job ${job.id} to thread #${workerInstance.id}`,
    );

    const cleanup = () => {
      if (workerInstance) workerInstance.activeJobId = null;
      this.dispatch();
    };

    workerInstance.worker.onmessage = (e: MessageEvent) => {
      const { type, progress, result, error } = e.data;

      switch (type) {
        case "PROGRESS":
          job.onProgress(progress);
          break;
        case "SUCCESS":
          console.log(
            `[WorkerPool] Job ${job.id} completed on thread #${workerInstance?.id}`,
          );
          job.onSuccess(result);
          cleanup();
          break;
        case "ERROR":
          job.onError(new Error(error));
          cleanup();
          break;
      }
    };

    workerInstance.worker.onerror = (err) => {
      job.onError(new Error(err.message || "Fatal Thread Exception"));
      cleanup();
    };

    // Відправляємо задачу в Web Worker (хендли передаються як масив або об'єкт)
    workerInstance.worker.postMessage({
      command: "START_CONVERSION",
      jobId: job.id,
      jobType: job.type,
      fileHandle: job.fileHandle,
      targetFormat: job.targetFormat,
      options: job.options,
    });
  }
}
