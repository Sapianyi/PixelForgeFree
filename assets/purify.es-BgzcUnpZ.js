function bt(n, o) {
	(o == null || o > n.length) && (o = n.length);
	for (var a = 0, s = Array(o); a < o; a++) s[a] = n[a];
	return s;
}
function on(n) {
	if (Array.isArray(n)) return n;
}
function rn(n, o) {
	var a = n == null ? null : typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
	if (a != null) {
		var s, f, p, R, ie = [], N = !0, pe = !1;
		try {
			if (p = (a = a.call(n)).next, o !== 0) for (; !(N = (s = p.call(a)).done) && (ie.push(s.value), ie.length !== o); N = !0);
		} catch (X) {
			pe = !0, f = X;
		} finally {
			try {
				if (!N && a.return != null && (R = a.return(), Object(R) !== R)) return;
			} finally {
				if (pe) throw f;
			}
		}
		return ie;
	}
}
function an() {
	throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function sn(n, o) {
	return on(n) || rn(n, o) || ln(n, o) || an();
}
function ln(n, o) {
	if (n) {
		if (typeof n == "string") return bt(n, o);
		var a = {}.toString.call(n).slice(8, -1);
		return a === "Object" && n.constructor && (a = n.constructor.name), a === "Map" || a === "Set" ? Array.from(n) : a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? bt(n, o) : void 0;
	}
}
const kt = Object.entries, Ot = Object.setPrototypeOf, cn = Object.isFrozen, un = Object.getPrototypeOf, fn = Object.getOwnPropertyDescriptor;
let I = Object.freeze, C = Object.seal, re = Object.create, Ft = typeof Reflect < "u" && Reflect, Je = Ft.apply, Qe = Ft.construct;
I || (I = function(o) {
	return o;
});
C || (C = function(o) {
	return o;
});
Je || (Je = function(o, a) {
	for (var s = arguments.length, f = new Array(s > 2 ? s - 2 : 0), p = 2; p < s; p++) f[p - 2] = arguments[p];
	return o.apply(a, f);
});
Qe || (Qe = function(o) {
	for (var a = arguments.length, s = new Array(a > 1 ? a - 1 : 0), f = 1; f < a; f++) s[f - 1] = arguments[f];
	return new o(...s);
});
const $ = E(Array.prototype.forEach), mn = E(Array.prototype.lastIndexOf), Rt = E(Array.prototype.pop), te = E(Array.prototype.push), pn = E(Array.prototype.splice), D = Array.isArray, me = E(String.prototype.toLowerCase), Xe = E(String.prototype.toString), Dt = E(String.prototype.match), ne = E(String.prototype.replace), It = E(String.prototype.indexOf), Tn = E(String.prototype.trim), dn = E(Number.prototype.toString), _n = E(Boolean.prototype.toString), Nt = typeof BigInt > "u" ? null : E(BigInt.prototype.toString), Lt = typeof Symbol > "u" ? null : E(Symbol.prototype.toString), T = E(Object.prototype.hasOwnProperty), fe = E(Object.prototype.toString), b = E(RegExp.prototype.test), oe = gn(TypeError);
function E(n) {
	return function(o) {
		o instanceof RegExp && (o.lastIndex = 0);
		for (var a = arguments.length, s = new Array(a > 1 ? a - 1 : 0), f = 1; f < a; f++) s[f - 1] = arguments[f];
		return Je(n, o, s);
	};
}
function gn(n) {
	return function() {
		for (var o = arguments.length, a = new Array(o), s = 0; s < o; s++) a[s] = arguments[s];
		return Qe(n, a);
	};
}
function l(n, o) {
	let a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : me;
	if (Ot && Ot(n, null), !D(o)) return n;
	let s = o.length;
	for (; s--;) {
		let f = o[s];
		if (typeof f == "string") {
			const p = a(f);
			p !== f && (cn(o) || (o[s] = p), f = p);
		}
		n[f] = !0;
	}
	return n;
}
function hn(n) {
	for (let o = 0; o < n.length; o++) T(n, o) || (n[o] = null);
	return n;
}
function O(n) {
	const o = re(null);
	for (const s of kt(n)) {
		var a = sn(s, 2);
		const f = a[0], p = a[1];
		T(n, f) && (D(p) ? o[f] = hn(p) : p && typeof p == "object" && p.constructor === Object ? o[f] = O(p) : o[f] = p);
	}
	return o;
}
function An(n) {
	switch (typeof n) {
		case "string": return n;
		case "number": return dn(n);
		case "boolean": return _n(n);
		case "bigint": return Nt ? Nt(n) : "0";
		case "symbol": return Lt ? Lt(n) : "Symbol()";
		case "undefined": return fe(n);
		case "function":
		case "object": {
			if (n === null) return fe(n);
			const o = n, a = F(o, "toString");
			if (typeof a == "function") {
				const s = a(o);
				return typeof s == "string" ? s : fe(s);
			}
			return fe(n);
		}
		default: return fe(n);
	}
}
function F(n, o) {
	for (; n !== null;) {
		const s = fn(n, o);
		if (s) {
			if (s.get) return E(s.get);
			if (typeof s.value == "function") return E(s.value);
		}
		n = un(n);
	}
	function a() {
		return null;
	}
	return a;
}
function En(n) {
	try {
		return b(n, ""), !0;
	} catch {
		return !1;
	}
}
const Ct = I([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]), Ve = I([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]), qe = I([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), Sn = I([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), Ke = I([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]), yn = I([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), wt = I(["#text"]), Mt = I([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]), Ze = I([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]), Pt = I([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]), Le = I([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), bn = C(/{{[\w\W]*|^[\w\W]*}}/g), On = C(/<%[\w\W]*|^[\w\W]*%>/g), Rn = C(/\${[\w\W]*/g), Dn = C(/^data-[\-\w.\u00B7-\uFFFF]+$/), In = C(/^aria-[\-\w]+$/), xt = C(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Nn = C(/^(?:\w+script|data):/i), Ln = C(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Cn = C(/^html$/i), wn = C(/^[a-z][.\w]*(-[.\w]+)+$/i), k = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	progressingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, Mn = function() {
	return typeof window > "u" ? null : window;
}, Pn = function(o, a) {
	if (typeof o != "object" || typeof o.createPolicy != "function") return null;
	let s = null;
	const f = "data-tt-policy-suffix";
	a && a.hasAttribute(f) && (s = a.getAttribute(f));
	const p = "dompurify" + (s ? "#" + s : "");
	try {
		return o.createPolicy(p, {
			createHTML(R) {
				return R;
			},
			createScriptURL(R) {
				return R;
			}
		});
	} catch {
		return null;
	}
}, vt = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
};
function Ut() {
	let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Mn();
	const o = (i) => Ut(i);
	if (o.version = "3.4.8", o.removed = [], !n || !n.document || n.document.nodeType !== k.document || !n.Element) return o.isSupported = !1, o;
	let a = n.document;
	const s = a, f = s.currentScript;
	n.DocumentFragment;
	const p = n.HTMLTemplateElement, R = n.Node, ie = n.Element, N = n.NodeFilter;
	n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
	const pe = n.DOMParser, X = n.trustedTypes, B = ie.prototype, Ht = F(B, "cloneNode"), zt = F(B, "remove"), Gt = F(B, "nextSibling"), Te = F(B, "childNodes"), de = F(B, "parentNode"), _e = F(B, "shadowRoot"), Wt = F(B, "attributes"), w = R && R.prototype ? F(R.prototype, "nodeType") : null, z = R && R.prototype ? F(R.prototype, "nodeName") : null;
	if (typeof p == "function") {
		const i = a.createElement("template");
		i.content && i.content.ownerDocument && (a = i.content.ownerDocument);
	}
	let L, ae = "", Ce = 0;
	const V = function(e) {
		if (Ce > 0) throw oe("The configured TRUSTED_TYPES_POLICY.createHTML must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose createHTML wraps DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
		Ce++;
		try {
			return L.createHTML(e);
		} finally {
			Ce--;
		}
	}, ge = a, we = ge.implementation, et = ge.createNodeIterator, Bt = ge.createDocumentFragment, Yt = ge.getElementsByTagName, jt = s.importNode;
	let S = vt();
	o.isSupported = typeof kt == "function" && typeof de == "function" && we && we.createHTMLDocument !== void 0;
	const he = bn, Ae = On, Ee = Rn, $t = Dn, Xt = In, Vt = Nn, tt = Ln, qt = wn;
	let nt = xt, d = null;
	const Me = l({}, [
		...Ct,
		...Ve,
		...qe,
		...Ke,
		...wt
	]);
	let A = null;
	const Pe = l({}, [
		...Mt,
		...Ze,
		...Pt,
		...Le
	]);
	let _ = Object.seal(re(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), se = null, Se = null;
	const G = Object.seal(re(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	}));
	let ot = !0, xe = !0, rt = !1, it = !0, W = !1, le = !0, Y = !1, ve = !1, ke = !1, q = !1, ye = !1, be = !1, at = !0, st = !1;
	const lt = "user-content-";
	let Fe = !0, ce = !1, K = {}, P = null;
	const Ue = l({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let ct = null;
	const ut = l({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let He = null;
	const ft = l({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), Oe = "http://www.w3.org/1998/Math/MathML", Re = "http://www.w3.org/2000/svg", x = "http://www.w3.org/1999/xhtml";
	let Z = x, ze = !1, Ge = null;
	const Kt = l({}, [
		Oe,
		Re,
		x
	], Xe);
	let We = l({}, [
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), Be = l({}, ["annotation-xml"]);
	const Zt = l({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let ue = null;
	const Jt = ["application/xhtml+xml", "text/html"], Qt = "text/html";
	let g = null, J = null;
	const en = a.createElement("form"), mt = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, Ye = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (J && J === e) return;
		(!e || typeof e != "object") && (e = {}), e = O(e), ue = Jt.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? Qt : e.PARSER_MEDIA_TYPE, g = ue === "application/xhtml+xml" ? Xe : me, d = T(e, "ALLOWED_TAGS") && D(e.ALLOWED_TAGS) ? l({}, e.ALLOWED_TAGS, g) : Me, A = T(e, "ALLOWED_ATTR") && D(e.ALLOWED_ATTR) ? l({}, e.ALLOWED_ATTR, g) : Pe, Ge = T(e, "ALLOWED_NAMESPACES") && D(e.ALLOWED_NAMESPACES) ? l({}, e.ALLOWED_NAMESPACES, Xe) : Kt, He = T(e, "ADD_URI_SAFE_ATTR") && D(e.ADD_URI_SAFE_ATTR) ? l(O(ft), e.ADD_URI_SAFE_ATTR, g) : ft, ct = T(e, "ADD_DATA_URI_TAGS") && D(e.ADD_DATA_URI_TAGS) ? l(O(ut), e.ADD_DATA_URI_TAGS, g) : ut, P = T(e, "FORBID_CONTENTS") && D(e.FORBID_CONTENTS) ? l({}, e.FORBID_CONTENTS, g) : Ue, se = T(e, "FORBID_TAGS") && D(e.FORBID_TAGS) ? l({}, e.FORBID_TAGS, g) : O({}), Se = T(e, "FORBID_ATTR") && D(e.FORBID_ATTR) ? l({}, e.FORBID_ATTR, g) : O({}), K = T(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? O(e.USE_PROFILES) : e.USE_PROFILES : !1, ot = e.ALLOW_ARIA_ATTR !== !1, xe = e.ALLOW_DATA_ATTR !== !1, rt = e.ALLOW_UNKNOWN_PROTOCOLS || !1, it = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, W = e.SAFE_FOR_TEMPLATES || !1, le = e.SAFE_FOR_XML !== !1, Y = e.WHOLE_DOCUMENT || !1, q = e.RETURN_DOM || !1, ye = e.RETURN_DOM_FRAGMENT || !1, be = e.RETURN_TRUSTED_TYPE || !1, ke = e.FORCE_BODY || !1, at = e.SANITIZE_DOM !== !1, st = e.SANITIZE_NAMED_PROPS || !1, Fe = e.KEEP_CONTENT !== !1, ce = e.IN_PLACE || !1, nt = En(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : xt, Z = typeof e.NAMESPACE == "string" ? e.NAMESPACE : x, We = T(e, "MATHML_TEXT_INTEGRATION_POINTS") && e.MATHML_TEXT_INTEGRATION_POINTS && typeof e.MATHML_TEXT_INTEGRATION_POINTS == "object" ? O(e.MATHML_TEXT_INTEGRATION_POINTS) : l({}, [
			"mi",
			"mo",
			"mn",
			"ms",
			"mtext"
		]), Be = T(e, "HTML_INTEGRATION_POINTS") && e.HTML_INTEGRATION_POINTS && typeof e.HTML_INTEGRATION_POINTS == "object" ? O(e.HTML_INTEGRATION_POINTS) : l({}, ["annotation-xml"]);
		const t = T(e, "CUSTOM_ELEMENT_HANDLING") && e.CUSTOM_ELEMENT_HANDLING && typeof e.CUSTOM_ELEMENT_HANDLING == "object" ? O(e.CUSTOM_ELEMENT_HANDLING) : re(null);
		if (_ = re(null), T(t, "tagNameCheck") && mt(t.tagNameCheck) && (_.tagNameCheck = t.tagNameCheck), T(t, "attributeNameCheck") && mt(t.attributeNameCheck) && (_.attributeNameCheck = t.attributeNameCheck), T(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (_.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), W && (xe = !1), ye && (q = !0), K && (d = l({}, wt), A = re(null), K.html === !0 && (l(d, Ct), l(A, Mt)), K.svg === !0 && (l(d, Ve), l(A, Ze), l(A, Le)), K.svgFilters === !0 && (l(d, qe), l(A, Ze), l(A, Le)), K.mathMl === !0 && (l(d, Ke), l(A, Pt), l(A, Le))), G.tagCheck = null, G.attributeCheck = null, T(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? G.tagCheck = e.ADD_TAGS : D(e.ADD_TAGS) && (d === Me && (d = O(d)), l(d, e.ADD_TAGS, g))), T(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? G.attributeCheck = e.ADD_ATTR : D(e.ADD_ATTR) && (A === Pe && (A = O(A)), l(A, e.ADD_ATTR, g))), T(e, "ADD_URI_SAFE_ATTR") && D(e.ADD_URI_SAFE_ATTR) && l(He, e.ADD_URI_SAFE_ATTR, g), T(e, "FORBID_CONTENTS") && D(e.FORBID_CONTENTS) && (P === Ue && (P = O(P)), l(P, e.FORBID_CONTENTS, g)), T(e, "ADD_FORBID_CONTENTS") && D(e.ADD_FORBID_CONTENTS) && (P === Ue && (P = O(P)), l(P, e.ADD_FORBID_CONTENTS, g)), Fe && (d["#text"] = !0), Y && l(d, [
			"html",
			"head",
			"body"
		]), d.table && (l(d, ["tbody"]), delete se.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw oe("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw oe("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			const r = L;
			L = e.TRUSTED_TYPES_POLICY;
			try {
				ae = V("");
			} catch (c) {
				throw L = r, c;
			}
		} else L === void 0 && e.TRUSTED_TYPES_POLICY !== null && (L = Pn(X, f)), L && typeof ae == "string" && (ae = V(""));
		(S.uponSanitizeElement.length > 0 || S.uponSanitizeAttribute.length > 0) && d === Me && (d = O(d)), S.uponSanitizeAttribute.length > 0 && A === Pe && (A = O(A)), I && I(e), J = e;
	}, pt = l({}, [
		...Ve,
		...qe,
		...Sn
	]), Tt = l({}, [...Ke, ...yn]), tn = function(e) {
		let t = de(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: Z,
			tagName: "template"
		});
		const r = me(e.tagName), c = me(t.tagName);
		return Ge[e.namespaceURI] ? e.namespaceURI === Re ? t.namespaceURI === x ? r === "svg" : t.namespaceURI === Oe ? r === "svg" && (c === "annotation-xml" || We[c]) : !!pt[r] : e.namespaceURI === Oe ? t.namespaceURI === x ? r === "math" : t.namespaceURI === Re ? r === "math" && Be[c] : !!Tt[r] : e.namespaceURI === x ? t.namespaceURI === Re && !Be[c] || t.namespaceURI === Oe && !We[c] ? !1 : !Tt[r] && (Zt[r] || !pt[r]) : !!(ue === "application/xhtml+xml" && Ge[e.namespaceURI]) : !1;
	}, M = function(e) {
		te(o.removed, { element: e });
		try {
			de(e).removeChild(e);
		} catch {
			zt(e);
		}
	}, j = function(e, t) {
		try {
			te(o.removed, {
				attribute: t.getAttributeNode(e),
				from: t
			});
		} catch {
			te(o.removed, {
				attribute: null,
				from: t
			});
		}
		if (t.removeAttribute(e), e === "is") if (q || ye) try {
			M(t);
		} catch {}
		else try {
			t.setAttribute(e, "");
		} catch {}
	}, dt = function(e) {
		let t = null, r = null;
		if (ke) e = "<remove></remove>" + e;
		else {
			const m = Dt(e, /^[\r\n\t ]+/);
			r = m && m[0];
		}
		ue === "application/xhtml+xml" && Z === x && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		const c = L ? V(e) : e;
		if (Z === x) try {
			t = new pe().parseFromString(c, ue);
		} catch {}
		if (!t || !t.documentElement) {
			t = we.createDocument(Z, "template", null);
			try {
				t.documentElement.innerHTML = ze ? ae : c;
			} catch {}
		}
		const u = t.body || t.documentElement;
		return e && r && u.insertBefore(a.createTextNode(r), u.childNodes[0] || null), Z === x ? Yt.call(t, Y ? "html" : "body")[0] : Y ? t.documentElement : u;
	}, _t = function(e) {
		return et.call(e.ownerDocument || e, e, N.SHOW_ELEMENT | N.SHOW_COMMENT | N.SHOW_TEXT | N.SHOW_PROCESSING_INSTRUCTION | N.SHOW_CDATA_SECTION, null);
	}, je = function(e) {
		var t, r;
		e.normalize();
		const c = et.call(e.ownerDocument || e, e, N.SHOW_TEXT | N.SHOW_COMMENT | N.SHOW_CDATA_SECTION | N.SHOW_PROCESSING_INSTRUCTION, null);
		let u = c.nextNode();
		for (; u;) {
			let h = u.data;
			$([
				he,
				Ae,
				Ee
			], (v) => {
				h = ne(h, v, " ");
			}), u.data = h, u = c.nextNode();
		}
		const m = (t = (r = e.querySelectorAll) === null || r === void 0 ? void 0 : r.call(e, "template")) !== null && t !== void 0 ? t : [];
		$(Array.from(m), (h) => {
			Q(h.content) && je(h.content);
		});
	}, De = function(e) {
		const t = z ? z(e) : null;
		return typeof t != "string" || g(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== Wt(e) || typeof e.removeAttribute != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== w(e) || e.childNodes !== Te(e);
	}, Q = function(e) {
		if (!w || typeof e != "object" || e === null) return !1;
		try {
			return w(e) === k.documentFragment;
		} catch {
			return !1;
		}
	}, Ie = function(e) {
		if (!w || typeof e != "object" || e === null) return !1;
		try {
			return typeof w(e) == "number";
		} catch {
			return !1;
		}
	};
	function U(i, e, t) {
		$(i, (r) => {
			r.call(o, e, t, J);
		});
	}
	const gt = function(e) {
		let t = null;
		if (U(S.beforeSanitizeElements, e, null), De(e)) return M(e), !0;
		const r = g(z ? z(e) : e.nodeName);
		if (U(S.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: d
		}), le && e.hasChildNodes() && !Ie(e.firstElementChild) && b(/<[/\w!]/g, e.innerHTML) && b(/<[/\w!]/g, e.textContent) || le && e.namespaceURI === x && r === "style" && Ie(e.firstElementChild) || e.nodeType === k.progressingInstruction || le && e.nodeType === k.comment && b(/<[/\w]/g, e.data)) return M(e), !0;
		if (se[r] || !(G.tagCheck instanceof Function && G.tagCheck(r)) && !d[r]) {
			if (!se[r] && At(r) && (_.tagNameCheck instanceof RegExp && b(_.tagNameCheck, r) || _.tagNameCheck instanceof Function && _.tagNameCheck(r))) return !1;
			if (Fe && !P[r]) {
				const c = de(e), u = Te(e);
				if (u && c) {
					const m = u.length;
					for (let h = m - 1; h >= 0; --h) {
						const v = Ht(u[h], !0);
						c.insertBefore(v, Gt(e));
					}
				}
			}
			return M(e), !0;
		}
		return (w ? w(e) : e.nodeType) === k.element && !tn(e) || (r === "noscript" || r === "noembed" || r === "noframes") && b(/<\/no(script|embed|frames)/i, e.innerHTML) ? (M(e), !0) : (W && e.nodeType === k.text && (t = e.textContent, $([
			he,
			Ae,
			Ee
		], (c) => {
			t = ne(t, c, " ");
		}), e.textContent !== t && (te(o.removed, { element: e.cloneNode() }), e.textContent = t)), U(S.afterSanitizeElements, e, null), !1);
	}, ht = function(e, t, r) {
		if (Se[t] || at && (t === "id" || t === "name") && (r in a || r in en)) return !1;
		const c = A[t] || G.attributeCheck instanceof Function && G.attributeCheck(t, e);
		if (!(xe && !Se[t] && b($t, t))) {
			if (!(ot && b(Xt, t))) {
				if (!c || Se[t]) {
					if (!(At(e) && (_.tagNameCheck instanceof RegExp && b(_.tagNameCheck, e) || _.tagNameCheck instanceof Function && _.tagNameCheck(e)) && (_.attributeNameCheck instanceof RegExp && b(_.attributeNameCheck, t) || _.attributeNameCheck instanceof Function && _.attributeNameCheck(t, e)) || t === "is" && _.allowCustomizedBuiltInElements && (_.tagNameCheck instanceof RegExp && b(_.tagNameCheck, r) || _.tagNameCheck instanceof Function && _.tagNameCheck(r)))) return !1;
				} else if (!He[t]) {
					if (!b(nt, ne(r, tt, ""))) {
						if (!((t === "src" || t === "xlink:href" || t === "href") && e !== "script" && It(r, "data:") === 0 && ct[e])) {
							if (!(rt && !b(Vt, ne(r, tt, "")))) {
								if (r) return !1;
							}
						}
					}
				}
			}
		}
		return !0;
	}, nn = l({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), At = function(e) {
		return !nn[me(e)] && b(qt, e);
	}, Et = function(e) {
		U(S.beforeSanitizeAttributes, e, null);
		const t = e.attributes;
		if (!t || De(e)) return;
		const r = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: A,
			forceKeepAttr: void 0
		};
		let c = t.length;
		for (; c--;) {
			const u = t[c], m = u.name, h = u.namespaceURI, v = u.value, H = g(m), $e = v;
			let y = m === "value" ? $e : Tn($e);
			if (r.attrName = H, r.attrValue = y, r.keepAttr = !0, r.forceKeepAttr = void 0, U(S.uponSanitizeAttribute, e, r), y = r.attrValue, st && (H === "id" || H === "name") && It(y, lt) !== 0 && (j(m, e), y = lt + y), le && b(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, y)) {
				j(m, e);
				continue;
			}
			if (H === "attributename" && Dt(y, "href")) {
				j(m, e);
				continue;
			}
			if (r.forceKeepAttr) continue;
			if (!r.keepAttr) {
				j(m, e);
				continue;
			}
			if (!it && b(/\/>/i, y)) {
				j(m, e);
				continue;
			}
			W && $([
				he,
				Ae,
				Ee
			], (yt) => {
				y = ne(y, yt, " ");
			});
			const St = g(e.nodeName);
			if (!ht(St, H, y)) {
				j(m, e);
				continue;
			}
			if (L && typeof X == "object" && typeof X.getAttributeType == "function" && !h) switch (X.getAttributeType(St, H)) {
				case "TrustedHTML":
					y = V(y);
					break;
				case "TrustedScriptURL":
					y = L.createScriptURL(y);
					break;
			}
			if (y !== $e) try {
				h ? e.setAttributeNS(h, m, y) : e.setAttribute(m, y), De(e) ? M(e) : Rt(o.removed);
			} catch {
				j(m, e);
			}
		}
		U(S.afterSanitizeAttributes, e, null);
	}, Ne = function(e) {
		let t = null;
		const r = _t(e);
		for (U(S.beforeSanitizeShadowDOM, e, null); t = r.nextNode();) if (U(S.uponSanitizeShadowNode, t, null), gt(t), Et(t), Q(t.content) && Ne(t.content), (w ? w(t) : t.nodeType) === k.element) {
			const c = _e ? _e(t) : t.shadowRoot;
			Q(c) && (ee(c), Ne(c));
		}
		U(S.afterSanitizeShadowDOM, e, null);
	}, ee = function(e) {
		const t = w ? w(e) : e.nodeType;
		if (t === k.element) {
			const u = _e ? _e(e) : e.shadowRoot;
			Q(u) && (ee(u), Ne(u));
		}
		const r = Te ? Te(e) : e.childNodes;
		if (!r) return;
		const c = [];
		$(r, (u) => {
			te(c, u);
		});
		for (const u of c) ee(u);
		if (t === k.element) {
			const u = z ? z(e) : null;
			if (typeof u == "string" && g(u) === "template") {
				const m = e.content;
				Q(m) && ee(m);
			}
		}
	};
	return o.sanitize = function(i) {
		let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, t = null, r = null, c = null, u = null;
		if (ze = !i, ze && (i = "<!-->"), typeof i != "string" && !Ie(i) && (i = An(i), typeof i != "string")) throw oe("dirty is not a string, aborting");
		if (!o.isSupported) return i;
		if (ve || Ye(e), o.removed = [], typeof i == "string" && (ce = !1), ce) {
			const v = z ? z(i) : i.nodeName;
			if (typeof v == "string") {
				const H = g(v);
				if (!d[H] || se[H]) throw oe("root node is forbidden and cannot be sanitized in-place");
			}
			if (De(i)) throw oe("root node is clobbered and cannot be sanitized in-place");
			ee(i);
		} else if (Ie(i)) t = dt("<!---->"), r = t.ownerDocument.importNode(i, !0), r.nodeType === k.element && r.nodeName === "BODY" || r.nodeName === "HTML" ? t = r : t.appendChild(r), ee(r);
		else {
			if (!q && !W && !Y && i.indexOf("<") === -1) return L && be ? V(i) : i;
			if (t = dt(i), !t) return q ? null : be ? ae : "";
		}
		t && ke && M(t.firstChild);
		const m = _t(ce ? i : t);
		for (; c = m.nextNode();) gt(c), Et(c), Q(c.content) && Ne(c.content);
		if (ce) return W && je(i), i;
		if (q) {
			if (W && je(t), ye) for (u = Bt.call(t.ownerDocument); t.firstChild;) u.appendChild(t.firstChild);
			else u = t;
			return (A.shadowroot || A.shadowrootmode) && (u = jt.call(s, u, !0)), u;
		}
		let h = Y ? t.outerHTML : t.innerHTML;
		return Y && d["!doctype"] && t.ownerDocument && t.ownerDocument.doctype && t.ownerDocument.doctype.name && b(Cn, t.ownerDocument.doctype.name) && (h = "<!DOCTYPE " + t.ownerDocument.doctype.name + `>
` + h), W && $([
			he,
			Ae,
			Ee
		], (v) => {
			h = ne(h, v, " ");
		}), L && be ? V(h) : h;
	}, o.setConfig = function() {
		Ye(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}), ve = !0;
	}, o.clearConfig = function() {
		J = null, ve = !1;
	}, o.isValidAttribute = function(i, e, t) {
		return J || Ye({}), ht(g(i), g(e), t);
	}, o.addHook = function(i, e) {
		typeof e == "function" && te(S[i], e);
	}, o.removeHook = function(i, e) {
		if (e !== void 0) {
			const t = mn(S[i], e);
			return t === -1 ? void 0 : pn(S[i], t, 1)[0];
		}
		return Rt(S[i]);
	}, o.removeHooks = function(i) {
		S[i] = [];
	}, o.removeAllHooks = function() {
		S = vt();
	}, o;
}
var xn = Ut();
export { xn as default };
