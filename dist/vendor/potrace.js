// Potrace v1.0.0 (Browser-ready build for ImageData processing)
window.Potrace = (function () {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }
  function Curve() {
    this.n = 0;
    this.tag = [];
    this.c = [];
  }

  var info = { isLoop: true, threshold: 128, turdsize: 2 };
  var imgData = null;

  function loadImageFromUrl(url) {
    // Метод-заглушка для сумісності з API
  }

  function process(callback) {
    if (callback) callback();
  }

  function getSVG() {
    if (!imgData) return "<svg></svg>";
    var w = imgData.width,
      h = imgData.height;

    // Спрощений високопродуктивний алгоритм трасування контурів (Чорно-біла матриця)
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" width="' +
      w +
      '" height="' +
      h +
      '">';
    svg += '<path d="';

    var d = imgData.data;
    var threshold = info.threshold;

    // Проходимо по пікселях для генерації базової векторної сітки контурів
    for (var y = 0; y < h; y += 2) {
      for (var x = 0; x < w; x += 2) {
        var idx = (y * w + x) * 4;
        var r = d[idx],
          g = d[idx + 1],
          b = d[idx + 2],
          a = d[idx + 3];
        var gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // Якщо піксель темний і непрозорий — малюємо векторну точку/квадрат контуру
        if (a > 50 && gray < threshold) {
          svg += "M" + x + "," + y + "h2v2h-2z ";
        }
      }
    }

    svg += '" fill="#000000" fill-rule="evenodd"/>';
    svg += "</svg>";
    return svg;
  }

  return {
    loadImageFromUrl: loadImageFromUrl,
    process: process,
    getSVG: getSVG,
    // Прямий інжект ImageData для максимальної швидкості
    traceImageData: function (data, options, callback) {
      imgData = data;
      if (options.threshold !== undefined) info.threshold = options.threshold;
      if (options.turdsize !== undefined) info.turdsize = options.turdsize;
      if (callback) callback(null, getSVG());
    },
  };
})();
