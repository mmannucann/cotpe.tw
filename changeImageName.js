// fix_img_src_spaces.js
// Usage: node fix_img_src_spaces.js <file.html> <images_folder>
//
// - <file.html>: path to the HTML file
// - <images_folder>: path to the folder that contains the images
//
// Script will:
//   * Load the HTML file
//   * Read all filenames in the given images folder
//   * Normalize (strip spaces, NBSP, lowercase) and compare
//   * If a match is found, replace the <img src> filename with the real one

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

if (process.argv.length < 3) {
  console.log("Usage: node fix_img_src_spaces.js <file.html> [images_folder]");
  process.exit(1);
}

const htmlFile = path.resolve(process.argv[2]);
const htmlFolder = path.dirname(htmlFile);

// If user gave images folder, use it, otherwise default to ./images
let imagesDir = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(htmlFolder, "images");

// Read HTML
let html;
try {
  html = fs.readFileSync(htmlFile, "utf8");
} catch (e) {
  console.error("❌ Cannot read HTML file:", htmlFile, e.message);
  process.exit(1);
}

const $ = cheerio.load(html);

// Read image files
let imageFiles = [];
if (fs.existsSync(imagesDir) && fs.statSync(imagesDir).isDirectory()) {
  imageFiles = fs.readdirSync(imagesDir).filter(f => !fs.statSync(path.join(imagesDir, f)).isDirectory());
} else {
  console.warn("⚠️  Images directory not found:", imagesDir);
}

// Normalize names
function normalizeName(name) {
  let decoded = name;
  try {
    if (/%[0-9a-fA-F]{2}/.test(name)) decoded = decodeURIComponent(name);
  } catch (_) {}
  return decoded.replace(/\u00A0/g, " ").replace(/\s+/g, "").toLowerCase();
}

// Build lookup map
const normalizedToReal = new Map();
for (const f of imageFiles) {
  normalizedToReal.set(normalizeName(f), f);
}

let fixes = 0;

$("div.custom_d_flex div.custom_div_flex a img").each((_, el) => {
  const $img = $(el);
  let src = $img.attr("src");
  if (!src) return;

  const qIndex = src.search(/[?#]/);
  const base = qIndex === -1 ? src : src.slice(0, qIndex);
  const suffix = qIndex === -1 ? "" : src.slice(qIndex);

  const lastSlash = base.lastIndexOf("/");
  const dirPart = lastSlash === -1 ? "" : base.slice(0, lastSlash + 1);
  const fileName = lastSlash === -1 ? base : base.slice(lastSlash + 1);

  const normalized = normalizeName(fileName);
  const real = normalizedToReal.get(normalized);

  if (real && real !== fileName) {
    const newSrc = dirPart + real + suffix;
    $img.attr("src", newSrc);
    fixes++;
    console.log(`✔ ${fileName} → ${real}`);
  }
});

if (fixes > 0) {
  fs.writeFileSync(htmlFile, $.html(), "utf8");
  console.log(`✅ Updated ${htmlFile} (${fixes} fix${fixes === 1 ? "" : "es"})`);
} else {
  console.log(`ℹ️ No changes needed for ${htmlFile}`);
}
