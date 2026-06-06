export interface RouteConfig {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  defaultFormat: string;
  seoContent: string; // Нове поле для автоматичного підвантаження лонгрідів
}

export const SEO_ROUTES: Record<string, RouteConfig> = {
  "/": {
    title: "PixelForge — 100% Client-Side Privacy-First Converter",
    description:
      "Convert PDFs, DOCX, EPUB, HEIC, and images completely offline in your browser. No files uploaded, zero server traces.",
    heading: "🔥 PixelForge Core",
    subheading:
      "High-performance multimedia pipeline running securely inside local sandbox memory.",
    defaultFormat: "webp",
    seoContent: `
      <h2>The New Standard of Secure File Optimization</h2>
      <p>Traditional file transformation ecosystems force operators to compromise privacy by staging confidential files onto volatile remote nodes. PixelForge solves this systemic vulnerability by engineering direct Client-Side conversion layers. By marrying low-level WebAssembly rendering bridges with responsive multi-threaded WebWorkers, your architecture processes digital pipelines locally within active browser RAM layers.</p>
      <h2>Zero Server Allocation. Ultimate Speed.</h2>
      <p>Because processing occurs purely inside your client layout box, the bottleneck of inbound network latency is eliminated. Whether optimizing corporate records or deploying digital books, PixelForge secures data Integrity from end to end.</p>
    `,
  },
  "/png-to-webp": {
    title: "Convert PNG to WebP Online — High Fidelity Optimization",
    description:
      "Convert PNG files to modern WebP assets locally. Reduce file weight by 30% while retaining alpha-channel transparency maps.",
    heading: "🖼️ PNG to WebP Transformer",
    subheading:
      "Extract and re-encode raster graphics into next-generation light assets.",
    defaultFormat: "webp",
    seoContent: `
      <h2>Why Optimize Image Footprints with WebP?</h2>
      <p>WebP stands as a premier modern image format engineered specifically for the open web. When webmasters transform legacy raw assets via a dedicated PNG to WebP converter, they achieve significant storage optimizations. WebP compression mathematics provide an average file weight reduction of 25% to 35% compared to baseline PNG configurations, without sacrificing visual rendering clarity.</p>
      <h2>Retaining Alpha Transparency Maps</h2>
      <p>One of the critical strengths of our local browser-ready conversion array is the seamless preservation of alpha-channel transparent background matrices. Unlike alternative compression formats that flatten layers, our pipeline ensures web graphics, interface icons, and marketing components remain clean, sharp, and lightweight.</p>
    `,
  },
  "/png-to-svg": {
    title: "Convert PNG to SVG Online — High Definition Vector Tracing",
    description:
      "Trace raster bitmaps into scalable vector graphics locally. Perfect for transforming icons and typography via Potrace matrix.",
    heading: "🖋️ PNG to SVG Vector Engine",
    subheading:
      "Process pixel geometry matrices into infinitely scalable vector path nodes.",
    defaultFormat: "svg",
    seoContent: `
      <h2>Mathematical Vector Contouring Explained</h2>
      <p>Transforming flat raster arrays via a high-definition PNG to SVG converter involves advanced geometric math. Instead of tracking static individual color grids, PixelForge utilizes an embedded client-side Potrace algorithm. This mechanism reads the brightness threshold map of your image, filters high-frequency graphical noise, and traces continuous path coordinates.</p>
      <h2>Infinite Scalability for Digital Interfaces</h2>
      <p>Vector graphics are critical assets for engineering responsive responsive interfaces. By converting raster bitmaps to vector SVG layers, logos, symbols, and typographic components scale flawlessly across massive screen densities, avoiding pixelation bugs entirely.</p>
    `,
  },
  "/pdf-to-epub": {
    title: "Convert PDF to EPUB Online — Reflowable Responsive Ebooks",
    description:
      "Convert PDF documents to valid electronic EPUB books. Extract typographic text nodes locally for uniform adaptive mobile reading.",
    heading: "📚 PDF to EPUB Ebook Compiler",
    subheading:
      "Extract text layout tracks and recompile them into standard adaptive books.",
    defaultFormat: "epub",
    seoContent: `
      <h2>Transitioning from Rigid Document Trees to Fluid Books</h2>
      <p>Static PDF rendering containers maintain strict coordinate systems that degrade readability on compact smartphone displays. Utilizing an intelligent PDF to EPUB converter allows you to transform rigid page boundaries into fluid text flows. PixelForge inspects the underlying XML textual stream of your document, filters formatting tracking noise, and assigns proper typographic line margins.</p>
      <h2>Valid IDPF Electronic Packaging Structure</h2>
      <p>Our converter does not simply output basic text blocks. The internal pipeline structures an authentic, fully compliant binary OEBPS book package. By auto-generating required metadata trees, clear spine nodes, navigation maps, and chapter divisions, the resulting asset passes strict validation on hardware readers like Kindle, Apple Books, and PocketBook.</p>
    `,
  },
  "/epub-to-pdf": {
    title: "Convert EPUB to PDF Online — High Fidelity Typography Print",
    description:
      "Recompile electronic books into clean vector PDF print layouts. Unpack OEBPS structures locally for system-level print arrays.",
    heading: "📄 EPUB to PDF Document Builder",
    subheading:
      "Unpack electronic publication archives and recompile text tracks into static layouts.",
    defaultFormat: "pdf",
    seoContent: `
      <h2>Compiling Adaptive Digital Publications for Layout Archiving</h2>
      <p>When compiling flowable content via an EPUB to PDF converter, the goal changes from flexibility to strict structural permanence. PixelForge unpacks the zipped publication archive in real-time memory using our integrated fflate decoder matrix. The extracted XHTML tracks are analyzed, and typography styles are dynamically mapped onto crisp vector printable layouts.</p>
      <h2>High Definition Vector Pagination Core</h2>
      <p>Our system uses an isolated background frame bridge to link document page flows directly with the system-level vector print rendering layer. This preserves embeddable text layouts and geometry contours, guaranteeing clean typographic reproduction on standard A4 or corporate presentation sheets.</p>
    `,
  },
  "/pdf-to-images": {
    title: "Convert PDF to JPG/PNG — High-Definition Page Extractor",
    description:
      "Extract individual PDF pages into high-density PNG, JPG, or WebP images locally. Adjust density scale mapping up to 4.0x.",
    heading: "📊 PDF Page Rasterization Grid",
    subheading:
      "Deconstruct document layers into independent graphic frame assets.",
    defaultFormat: "png",
    seoContent: `
      <h2>Precision Document Page Rasterization</h2>
      <p>Extracting high-fidelity layers via an advanced PDF to PNG converter requires intense browser graphic rendering coordination. PixelForge links the official Mozilla PDFJS engine directly with an offscreen asynchronous canvas. This architecture parses vector text paths and layout markers, converting them into crystal-clear uncompressed pixel maps.</p>
      <h2>Complete Next-Gen Output Format Control</h2>
      <p>Engineers can adjust the density canvas rendering scale up to 4.0x DPI for clear printing zoom capability. Our dynamic selection panel lets you specify whether you want lossless PNG grids, optimized JPG compression, or ultra-modern next-gen WebP configurations for web integration.</p>
    `,
  },
};
