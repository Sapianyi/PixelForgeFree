import { SEO_ROUTES } from "./core/routes";
import { OPFSStorage } from "./core/OPFSStorage";
import { WorkerPool, type PoolJob } from "./core/WorkerPool";

let selectedFiles: File[] = [];

// DOM Elements
const dropzone = document.getElementById("dropzone") as HTMLDivElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const logOutput = document.getElementById("log-output") as HTMLDivElement;
const clearLogBtn = document.getElementById(
  "clear-log-btn",
) as HTMLButtonElement;
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const fileListContainer = document.getElementById(
  "file-list-container",
) as HTMLDivElement;
const fileList = document.getElementById("file-list") as HTMLUListElement;
const targetFormatSelect = document.getElementById(
  "target-format",
) as HTMLSelectElement;
const dynamicOptionsContainer = document.getElementById(
  "dynamic-options",
) as HTMLDivElement;

const seoTitle = document.getElementById("seo-title") as HTMLTitleElement;
const seoDesc = document.getElementById("seo-desc") as HTMLMetaElement;
const mainHeading = document.getElementById(
  "main-heading",
) as HTMLHeadingElement;
const mainSubheading = document.getElementById(
  "main-subheading",
) as HTMLParagraphElement;

// 🔥 Функція логування тепер вміє рендерити HTML-елементи (кнопки скасування)
function log(
  message: string,
  type: "system" | "pipeline" | "success" = "system",
  htmlElement?: HTMLElement,
) {
  const line = document.createElement("div");
  line.className = `log-line ${type}`;

  const time = new Date().toLocaleTimeString();

  // Базовий текст логу
  const textSpan = document.createElement("span");
  textSpan.innerHTML = `[${time}] ${message}`;
  line.appendChild(textSpan);

  // Якщо передано інтерактивний елемент (кнопка скасування) — вмонтовуємо його нативно
  if (htmlElement) {
    line.appendChild(htmlElement);
  }

  logOutput.appendChild(line);
  logOutput.scrollTop = logOutput.scrollHeight;
}

// 🔥 ПУНКТ 6: ДИНАМІЧНИЙ РЕНДЕРИНГ ОПЦІЙ З ПІДТРИМКОЮ WEBP ДЛЯ ДОКУМЕНТІВ
function renderDynamicOptions(format: string) {
  const path = window.location.pathname;
  const graphicFormats = ["webp", "png", "jpg", "jpeg", "svg"];

  if (path === "/pdf-to-images") {
    dynamicOptionsContainer.innerHTML = `
      <div class="options-grid" style="display: flex; gap: 20px; margin-top: 15px; padding: 10px; background: #18181b; border-radius: 6px; border: 1px solid #27272a;">
        <div class="control-group" style="flex: 1;">
          <label for="pdf-scale" style="display:block; margin-bottom:5px; font-size:12px; color:#a1a1aa">Render Density (Scale): <span id="scale-val">2.0</span>x</label>
          <input type="range" id="pdf-scale" min="1.0" max="4.0" step="0.5" value="2.0" style="width:100%">
        </div>
        <div class="control-group" style="flex: 1;">
          <label style="display:block; margin-bottom:5px; font-size:12px; color:#a1a1aa">Output Format Core:</label>
          <select id="pdf-target-format-sync" style="background:#09090b; color:white; border:1px solid #27272a; padding:4px; border-radius:4px; font-size:13px; width:100%;">
            <option value="png">PNG (Lossless)</option>
            <option value="jpg">JPG (Compressed)</option>
            <option value="webp">WebP (Next-Gen High Performance)</option>
          </select>
        </div>
      </div>
    `;
    const sInput = document.getElementById("pdf-scale") as HTMLInputElement;
    const sVal = document.getElementById("scale-val") as HTMLSpanElement;
    sInput.addEventListener(
      "input",
      () => (sVal.textContent = parseFloat(sInput.value).toFixed(1)),
    );
    return;
  }

  if (path === "/jpg-to-pdf" || path === "/heic-to-pdf") {
    dynamicOptionsContainer.innerHTML = `
      <div style="margin-top: 15px; padding: 10px; background: #111827; border-radius: 6px; border: 1px solid #3b82f6; color: #60a5fa; font-size: 13px;">
        📂 <strong>Multi-Page Compiler Mode:</strong> All uploaded assets will be compiled sequentially into a single layout PDF document.
      </div>
    `;
    return;
  }

  if (
    ["/docx-to-pdf", "/pdf-to-word", "/pdf-to-epub", "/epub-to-pdf"].includes(
      path,
    )
  ) {
    dynamicOptionsContainer.innerHTML = `
      <div style="margin-top: 15px; padding: 10px; background: #18181b; border-radius: 6px; border: 1px solid #27272a; color: #a1a1aa; font-size: 13px;">
        ⚙️ Typographic Layout Sync: <strong>Enabled</strong>. Locally stream processing metadata nodes.
      </div>
    `;
    return;
  }

  if (format === "svg") {
    dynamicOptionsContainer.innerHTML = `
      <div class="options-grid" style="display: flex; gap: 20px; margin-top: 15px; padding: 10px; background: #18181b; border-radius: 6px; border: 1px solid #27272a;">
        <div class="control-group" style="flex: 1;">
          <label for="svg-threshold" style="display:block; margin-bottom:5px; font-size:12px; color:#a1a1aa">Contrast Threshold: <span id="threshold-val">128</span></label>
          <input type="range" id="svg-threshold" min="0" max="255" value="128" style="width:100%">
        </div>
        <div class="control-group" style="flex: 1;">
          <label for="svg-turdsize" style="display:block; margin-bottom:5px; font-size:12px; color:#a1a1aa">Suppress Noise: <span id="turd-val">2</span> px</label>
          <input type="range" id="svg-turdsize" min="0" max="100" value="2" style="width:100%">
        </div>
      </div>
    `;
    const tInput = document.getElementById("svg-threshold") as HTMLInputElement;
    const tVal = document.getElementById("threshold-val") as HTMLSpanElement;
    tInput.addEventListener("input", () => (tVal.textContent = tInput.value));
    return;
  }

  if (graphicFormats.includes(format)) {
    const showQuality = format !== "png";
    dynamicOptionsContainer.innerHTML = `
      <div class="options-grid" style="display: flex; gap: 20px; margin-top: 15px; padding: 10px; background: #18181b; border-radius: 6px; border: 1px solid #27272a;">
        ${
          showQuality
            ? `
          <div class="control-group" style="flex: 1;">
            <label for="img-quality" style="display:block; margin-bottom:5px; font-size:12px; color:#a1a1aa">Compression Quality: <span id="quality-val">85</span>%</label>
            <input type="range" id="img-quality" min="1" max="100" value="85" style="width:100%">
          </div>
        `
            : ""
        }
        <div class="control-group" style="flex: 1;">
          <label for="img-resize" style="display:block; margin-bottom:5px; font-size:12px; color:#a1a1aa">Max Width (Optional, px):</label>
          <input type="number" id="img-resize" placeholder="Original width" style="width:100%; background:#09090b; border:1px solid #27272a; color:white; padding:4px 8px; border-radius:4px; font-size:13px;">
        </div>
      </div>
    `;
    if (showQuality) {
      const qInput = document.getElementById("img-quality") as HTMLInputElement;
      const qVal = document.getElementById("quality-val") as HTMLSpanElement;
      qInput.addEventListener("input", () => (qVal.textContent = qInput.value));
    }
  } else {
    dynamicOptionsContainer.innerHTML = "";
  }
}

function initAccordions() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const parent = trigger.parentElement;
      if (!parent) return;
      document.querySelectorAll(".accordion-item").forEach((item) => {
        if (item !== parent) item.classList.remove("active");
      });
      parent.classList.toggle("active");
    });
  });
}

function updateActiveLinkInAccordion(path: string) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
      const accordionItem = link.closest(".accordion-item");
      if (accordionItem) accordionItem.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function initRouter() {
  const path = window.location.pathname;
  const config = SEO_ROUTES[path] || SEO_ROUTES["/"];

  seoTitle.textContent = config.title;
  if (seoDesc) seoDesc.setAttribute("content", config.description);
  mainHeading.textContent = config.heading;
  mainSubheading.textContent = config.subheading;

  // 🌟 НАДПОВУЖНИЙ ІНЖЕКТ ДИНАМІЧНОГО SEO-КОНТЕНТУ (Пункт 1)
  const seoArticle = document.getElementById("dynamic-seo-article");
  if (seoArticle) {
    seoArticle.innerHTML = config.seoContent || "";
  }

  targetFormatSelect.value = config.defaultFormat;
  renderDynamicOptions(config.defaultFormat);
  updateActiveLinkInAccordion(path);
  console.log(
    `[Router] Successfully synchronized pipeline for SEO path: ${path}`,
  );
}

function initNavigationListeners() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href) {
        window.history.pushState({}, "", href);
        initRouter();
      }
    });
  });
}

function updateFileList() {
  if (selectedFiles.length === 0) {
    fileListContainer.classList.add("hidden");
    startBtn.disabled = true;
    return;
  }
  fileListContainer.classList.remove("hidden");
  startBtn.disabled = false;
  fileList.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const li = document.createElement("li");
    li.className = "file-item";

    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    li.innerHTML = `<span>📄 ${file.name} <span style="color:#a1a1aa; font-size:12px; margin-left:10px;">${sizeInMb} MB</span></span>`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.cssText =
      "background:#ef4444; color:white; padding:2px 8px; font-size:11px; border:none; border-radius:4px; cursor:pointer;";
    removeBtn.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      updateFileList();
    });

    li.appendChild(removeBtn);
    fileList.appendChild(li);
  });
}

// 🔥 ПУНКТ 7: ЖОРСТКИЙ ЛІМІТАТОР РЕСУРСІВ ДО 500 МБ ПЕРЕД ЗАПИСОМ В OPFS
function handleFiles(files: FileList) {
  const MAX_SIZE = 500 * 1024 * 1024; // 500MB Limit
  const newFiles = Array.from(files);

  for (const file of newFiles) {
    if (file.size > MAX_SIZE) {
      log(
        `File [${file.name}] rejected! Exceeds the secure 500MB client-side execution limit.`,
        "pipeline",
      );
      alert(
        `Security Rule: File "${file.name}" exceeds the 500MB limit. Thread skipped to protect sandbox from crash.`,
      );
      continue;
    }
    if (selectedFiles.length < 500) {
      selectedFiles.push(file);
    }
  }
  log(
    `Synchronized files registry. Total processing queue size: ${selectedFiles.length}`,
    "pipeline",
  );
  updateFileList();
}

targetFormatSelect.addEventListener("change", () => {
  renderDynamicOptions(targetFormatSelect.value);
});

dropzone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  if (fileInput.files) handleFiles(fileInput.files);
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, () =>
    dropzone.classList.remove("dragover"),
  );
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
});

clearLogBtn.addEventListener("click", () => {
  logOutput.innerHTML = "";
  log("Logs cleared.", "system");
});

// КНОПКА СТАРТУ — ОБРОБНИК СИСТЕМИ РОУТИНГУ ТАСОК
startBtn.addEventListener("click", async () => {
  let currentTargetFormat = targetFormatSelect.value;
  if (selectedFiles.length === 0) return;

  const path = window.location.pathname;

  // Синхронізація розширень
  if (path === "/pdf-to-epub") currentTargetFormat = "epub";
  if (path === "/pdf-to-word") currentTargetFormat = "docx";
  if (path === "/epub-to-pdf") currentTargetFormat = "pdf";
  if (path === "/pdf-to-images") {
    const syncSelect = document.getElementById(
      "pdf-target-format-sync",
    ) as HTMLSelectElement | null;
    currentTargetFormat = syncSelect ? syncSelect.value : "png";
  }

  let conversionOptions: Record<string, any> = {};

  if (path === "/pdf-to-images") {
    const scaleInput = document.getElementById(
      "pdf-scale",
    ) as HTMLInputElement | null;
    conversionOptions = {
      scale: scaleInput ? parseFloat(scaleInput.value) : 2.0,
    };
  } else if (currentTargetFormat === "svg") {
    const thresholdInput = document.getElementById(
      "svg-threshold",
    ) as HTMLInputElement | null;
    const turdInput = document.getElementById(
      "svg-turdsize",
    ) as HTMLInputElement | null;
    conversionOptions = {
      threshold: thresholdInput ? parseInt(thresholdInput.value, 10) : 128,
      turdsize: turdInput ? parseInt(turdInput.value, 10) : 2,
    };
  } else {
    const qualityInput = document.getElementById(
      "img-quality",
    ) as HTMLInputElement | null;
    const resizeInput = document.getElementById(
      "img-resize",
    ) as HTMLInputElement | null;
    conversionOptions = {
      quality: qualityInput ? parseInt(qualityInput.value, 10) : 85,
      width:
        resizeInput && resizeInput.value
          ? parseInt(resizeInput.value, 10)
          : undefined,
    };
  }

  log(
    `Executing batch conversion for ${selectedFiles.length} asset(s) into [${currentTargetFormat.toUpperCase()}]...`,
    "pipeline",
  );

  const storage = OPFSStorage.getInstance();
  const pool = WorkerPool.getInstance();

  const filesToProcess = [...selectedFiles];
  selectedFiles = [];
  updateFileList();

  // 🔥 2. ПАКЕТНИЙ ПЕРЕХОПЛЮВАЧ ДЛЯ JPG/HEIC TO PDF (ЗШИВАННЯ)
  if (path === "/jpg-to-pdf" || path === "/heic-to-pdf") {
    const batchJobId = Math.random().toString(36).substring(7);
    log(
      `[Pool Pipeline] Staging ${filesToProcess.length} asset(s) to secure multi-page OPFS registry...`,
      "system",
    );

    try {
      const handles: FileSystemFileHandle[] = [];

      for (let i = 0; i < filesToProcess.length; i++) {
        let file = filesToProcess[i];
        let inputExt = file.name.split(".").pop()?.toLowerCase() || "";

        if (inputExt === "heic") {
          log(
            `[HEIC Bridge] Processing container [${file.name}] before compilation...`,
            "system",
          );
          const heic2any = (await import("heic2any")).default;
          const decodedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9,
          });
          file = new File(
            [decodedBlob as Blob],
            file.name.replace(/\.heic$/i, ".jpg"),
            { type: "image/jpeg" },
          );
        }

        const handle = await storage.writeInboundFile(
          `${batchJobId}_${i}`,
          file,
        );
        handles.push(handle);
      }

      // Створюємо нативну кнопку скасування
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.cssText =
        "background:#ef4444; color:white; padding:1px 6px; font-size:11px; border:none; border-radius:3px; margin-left:10px; cursor:pointer;";
      cancelBtn.addEventListener("click", () => {
        pool.cancelJob(batchJobId);
        cancelBtn.disabled = true;
        cancelBtn.style.background = "#52525b";
      });

      log(
        `[Document Job ${batchJobId}] Initiated container layout stack. `,
        "pipeline",
        cancelBtn,
      );

      const job: PoolJob = {
        id: batchJobId,
        type: "document",
        fileHandle: handles,
        targetFormat: currentTargetFormat,
        options: conversionOptions,
        onProgress: (progress) => {
          log(
            `[Document Job ${batchJobId}] Compiling layout: ${progress}%`,
            "pipeline",
          );
        },
        onSuccess: async (resultBlob) => {
          log(
            `[Document Job ${batchJobId}] PDF compiled successfully!`,
            "success",
          );
          cancelBtn.remove();
          const url = URL.createObjectURL(resultBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `compiled_document_${batchJobId}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
          for (const h of handles) await storage.deleteFile(h.name);
        },
        onError: async (error) => {
          log(
            `[Document Job ${batchJobId}] Compilation stopped: ${error.message}`,
            "pipeline",
          );
          cancelBtn.remove();
          for (const h of handles) await storage.deleteFile(h.name);
        },
      };

      pool.enqueue(job);
      return;
    } catch (err: any) {
      log(`Document Package Staging Failed: ${err.message}`, "pipeline");
      return;
    }
  }

  // --- СТАНДАРТНИЙ ПОШТУЧНИЙ ЦИКЛ ОБРОБКИ ДЛЯ РЕШТИ КОНВЕЄРІВ ---
  for (let i = 0; i < filesToProcess.length; i++) {
    let file = filesToProcess[i];
    const jobId = Math.random().toString(36).substring(7);
    let inputExt = file.name.split(".").pop()?.toLowerCase() || "";

    // 🔥 АВТОНОМНИЙ ПЕРЕХОПЛЮВАЧ APPLE HEIC НА МЕЙН-ПОТОЦІ
    if (inputExt === "heic" && currentTargetFormat !== "pdf") {
      log(
        `[HEIC Bridge] Extracting Apple Photo container via local memory decoder...`,
        "system",
      );
      try {
        const heic2any = (await import("heic2any")).default;
        const decodedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.95,
        });
        file = new File(
          [decodedBlob as Blob],
          file.name.replace(/\.heic$/i, ".jpg"),
          { type: "image/jpeg" },
        );
        inputExt = "jpg";
        log(
          `[HEIC Bridge] Target layer trace successful. Forwarding to parallel WorkerPool.`,
          "success",
        );
      } catch (heicErr: any) {
        log(
          `[HEIC Bridge Critical]: ${heicErr.message || "Failed to decode alternative Apple format."}`,
          "pipeline",
        );
        continue;
      }
    }

    // 🔥 АВТОНОМНИЙ ПЕРЕХОПЛЮВАЧ ВЕКТОРНОГО ТРЕЙСИНГУ (PNG/JPG TO SVG)
    if (currentTargetFormat === "svg") {
      log(
        `[Vector Bridge] Analyzing raster geometry for job ${jobId}...`,
        "system",
      );
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context extraction failed");

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(img.src);

        log(
          `[Vector Bridge] Tracing contours via local Potrace mathematical matrix...`,
          "system",
        );
        const traceEngine = (window as any).Potrace;

        const svgCode = await new Promise<string>(
          (resolveTrace, rejectTrace) => {
            traceEngine.traceImageData(
              imageData,
              {
                threshold: conversionOptions.threshold ?? 128,
                turdsize: conversionOptions.turdsize ?? 2,
              },
              (err: any, code: string) => {
                if (err) rejectTrace(err);
                else resolveTrace(code);
              },
            );
          },
        );

        log(
          `[Vector Bridge] Job ${jobId} compiled successfully to scalable vector!`,
          "success",
        );
        const resultBlob = new Blob([svgCode], { type: "image/svg+xml" });
        const url = URL.createObjectURL(resultBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `converted_${file.name.substring(0, file.name.lastIndexOf(".")) || file.name}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        continue;
      } catch (svgErr: any) {
        log(
          `[Vector Bridge Critical]: ${svgErr.message || svgErr}`,
          "pipeline",
        );
        continue;
      }
    }

    // 🔥 3. АВТОНОМНИЙ ПЕРЕХОПЛЮВАЧ WORD ДОКУМЕНТІВ (DOCX TO PDF) НА МЕЙН-ПОТОЦІ
    if (path === "/docx-to-pdf" || inputExt === "docx") {
      log(
        `[Word Bridge] Unpacking docx typographic XML container for ${file.name}...`,
        "system",
      );
      try {
        const docx = await import("docx-preview");
        const arrayBuffer = await file.arrayBuffer();

        const sandbox = document.createElement("div");
        sandbox.id = `word-sandbox-${jobId}`;
        sandbox.style.cssText =
          "position:fixed; left:-9999px; top:-9999px; width:800px; background:white; color:black;";
        document.body.appendChild(sandbox);

        log(
          `[Word Bridge] Synthesizing HTML page flows and embedded stylesheets...`,
          "system",
        );
        await docx.renderAsync(arrayBuffer, sandbox, undefined, {
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
        });

        log(
          `[Word Bridge] Document rendered inside shadow layer. Opening native high-fidelity print core...`,
          "success",
        );

        const printFrame = document.createElement("iframe");
        printFrame.style.cssText =
          "position:fixed; right:0; bottom:0; width:0; height:0; border:none;";
        document.body.appendChild(printFrame);

        const frameDoc =
          printFrame.contentWindow?.document || printFrame.contentDocument;
        if (frameDoc) {
          frameDoc.write(
            `<html><head><title>Print</title><style>body { margin: 0; background: white; } ${Array.from(
              document.querySelectorAll(`style`),
            )
              .map((s) => s.innerHTML)
              .join(
                "\n",
              )}</style></head><body>${sandbox.innerHTML}<script>window.onload = function() { window.print(); setTimeout(function() { window.parent.postMessage({ type: "PRINTER_DONE", jobId: "${jobId}" }, "*"); }, 1000); };</script></body></html>`,
          );
          frameDoc.close();
        }

        await new Promise<void>((resolvePrinter) => {
          const handleMessage = (event: MessageEvent) => {
            if (
              event.data?.type === "PRINTER_DONE" &&
              event.data?.jobId === jobId
            ) {
              window.removeEventListener("message", handleMessage);
              sandbox.remove();
              printFrame.remove();
              log(
                `[Word Bridge] Job ${jobId} compiled successfully via system vector layers!`,
                "success",
              );
              resolvePrinter();
            }
          };
          window.addEventListener("message", handleMessage);
        });
        continue;
      } catch (docxErr: any) {
        log(
          `[Word Bridge Critical]: ${docxErr.message || docxErr}`,
          "pipeline",
        );
        document.getElementById(`word-sandbox-${jobId}`)?.remove();
        continue;
      }
    }

    // 🔥 4. АВТОНОМНИЙ ПЕРЕХОПЛЮВАЧ ЕЛЕКТРОННИХ КНИГ (EPUB / XHTML TO PDF) НА МЕЙН-ПОТОЦІ
    if (
      path === "/epub-to-pdf" ||
      inputExt === "epub" ||
      inputExt === "xhtml" ||
      inputExt === "html"
    ) {
      log(
        `[Ebook Bridge] Analyzing electronic book container for ${file.name}...`,
        "system",
      );
      try {
        let bookHtml = "";
        const arrayBuffer = await file.arrayBuffer();
        const view = new Uint8Array(arrayBuffer);
        const isZip = view.length > 4 && view[0] === 80 && view[1] === 75;

        if (!isZip) {
          bookHtml = new TextDecoder("utf-8").decode(view);
        } else {
          const { unzipSync } = await import("fflate");
          const unzipped = unzipSync(view);
          const textFiles = Object.keys(unzipped)
            .filter((name) => name.endsWith(".xhtml") || name.endsWith(".html"))
            .sort();
          if (textFiles.length === 0)
            throw new Error(
              "No readable text tracks found inside EPUB container.",
            );

          const decoder = new TextDecoder("utf-8");
          let fullBodyContent = "";
          textFiles.forEach((fileName) => {
            const rawText = decoder.decode(unzipped[fileName]);
            const bodyMatch = rawText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            fullBodyContent += `<div class="epub-chapter" style="page-break-after: always; margin-bottom: 30px;">${bodyMatch ? bodyMatch[1] : rawText}</div>\n`;
          });

          bookHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body { font-family: "Georgia", serif; padding: 40px; line-height: 1.6; color: #000; background: #fff; } h1, h2, h3 { text-align: center; color: #111; page-break-after: avoid; } p { text-indent: 2em; margin: 0 0 1em 0; text-align: justify; }</style></head><body>${fullBodyContent}</body></html>`;
        }

        const printFrame = document.createElement("iframe");
        printFrame.style.cssText =
          "position:fixed; left:-9999px; top:-9999px; width:800px; height:1100px; border:none;";
        document.body.appendChild(printFrame);

        const frameDoc =
          printFrame.contentWindow?.document || printFrame.contentDocument;
        if (frameDoc) {
          frameDoc.open();
          frameDoc.write(bookHtml);
          frameDoc.close();
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        }
        setTimeout(() => printFrame.remove(), 1500);
        log(
          `[Ebook Bridge] Job ${jobId} compiled successfully via system vector layers!`,
          "success",
        );
        continue;
      } catch (epubErr: any) {
        log(
          `[Ebook Bridge Critical]: ${epubErr.message || epubErr}`,
          "pipeline",
        );
        continue;
      }
    }

    // Визначення типів тасок
    let jobType: "image" | "pdf" | "document" | "ebook" = "image";

    if (
      path === "/pdf-to-images" ||
      path === "/pdf-to-word" ||
      path === "/pdf-to-epub" ||
      inputExt === "pdf"
    ) {
      jobType = "pdf";
    } else if (["/docx-to-pdf", "/jpg-to-pdf", "/heic-to-pdf"].includes(path)) {
      // @ts-ignore
      jobType = "document";
    } else if (["/epub-to-pdf"].includes(path)) {
      // @ts-ignore
      jobType = "ebook";
    } else {
      jobType = "image";
    }

    // --- ГРАФІЧНИЙ ТА ДОКУМЕНТНИЙ ПОТОК (WorkerPool + OPFS) ---
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.cssText =
      "background:#ef4444; color:white; padding:1px 6px; font-size:11px; border:none; border-radius:3px; margin-left:10px; cursor:pointer;";

    // 🔥 ВИПРАВЛЕНО: Обгортаємо додавання події в setTimeout, щоб гарантувати наявність таски в черзі пулу на момент кліку
    const currentJobId = jobId;
    setTimeout(() => {
      cancelBtn.addEventListener("click", () => {
        pool.cancelJob(currentJobId);
        cancelBtn.disabled = true;
        cancelBtn.style.background = "#52525b";
      });
    }, 10);

    log(
      `[Pool Pipeline] Staging ${jobType.toUpperCase()} asset "${file.name}" to OPFS... `,
      "system",
      cancelBtn,
    );

    try {
      const handle = await storage.writeInboundFile(jobId, file);

      const job: PoolJob = {
        id: jobId,
        type: jobType,
        fileHandle: handle,
        targetFormat: currentTargetFormat,
        options: conversionOptions,
        onProgress: (progress) => {
          log(`[Job ${jobId}] Processing: ${progress}%`, "pipeline");
        },
        onSuccess: async (resultBlob) => {
          log(
            `[Job ${jobId}] ${jobType.toUpperCase()} compiled successfully!`,
            "success",
          );
          cancelBtn.remove();
          const url = URL.createObjectURL(resultBlob);
          const a = document.createElement("a");
          a.href = url;

          let finalExt = currentTargetFormat;
          if (
            resultBlob.type === "application/epub+zip" ||
            path === "/pdf-to-epub"
          )
            finalExt = "epub";

          a.download = `converted_${file.name.substring(0, file.name.lastIndexOf(".")) || file.name}.${finalExt}`;
          a.click();
          URL.revokeObjectURL(url);
          await storage.deleteFile(handle.name);
        },
        onError: async (error) => {
          log(`[Job ${jobId}] Stopped: ${error.message}`, "pipeline");
          cancelBtn.remove();
          await storage.deleteFile(handle.name);
        },
      };

      pool.enqueue(job);
    } catch (err: any) {
      log(
        `Pipeline Staging Failed for ${file.name}: ${err.message}`,
        "pipeline",
      );
    }
  }
});

window.addEventListener("popstate", initRouter);

initAccordions();
initNavigationListeners();
initRouter();

OPFSStorage.getInstance().clearAllStorage().catch(console.error);
