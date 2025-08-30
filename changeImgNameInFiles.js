// fix_generated_images.js
// Usage: node fix_generated_images.js <html_folder> <images_folder>

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

if (process.argv.length < 4) {
  console.log("Usage: node fix_generated_images.js <html_folder> <images_folder>");
  process.exit(1);
}

const htmlDir = path.resolve(process.argv[2]);
const imagesDir = path.resolve(process.argv[3]);

// --- check dirs ---
if (!fs.existsSync(htmlDir) || !fs.statSync(htmlDir).isDirectory()) {
  console.error("❌ Invalid HTML folder:", htmlDir);
  process.exit(1);
}
if (!fs.existsSync(imagesDir) || !fs.statSync(imagesDir).isDirectory()) {
  console.error("❌ Invalid images folder:", imagesDir);
  process.exit(1);
}

// --- normalize fn ---
function normalizeName(name) {
  let decoded = name;
  try {
    if (/%[0-9a-fA-F]{2}/.test(name)) decoded = decodeURIComponent(name);
  } catch (_) {}
  return decoded.replace(/\u00A0/g, " ").replace(/\s+/g, "").toLowerCase();
}

// --- get image list ---
const imageFiles = fs.readdirSync(imagesDir).filter(f => !fs.statSync(path.join(imagesDir, f)).isDirectory());
const normalizedToReal = new Map();
for (const f of imageFiles) {
  normalizedToReal.set(normalizeName(f), f);
}

// --- process html files ---
const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.toLowerCase().endsWith(".html"));

for (const file of htmlFiles) {
  const filePath = path.join(htmlDir, file);

  let html;
  try {
    html = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.warn("⚠️ Cannot read:", filePath, e.message);
    continue;
  }

  const $ = cheerio.load(html);
  let fixes = 0;

  $("div.generatedImage img").each((_, el) => {
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
      console.log(`✔ [${file}] ${fileName} → ${real}`);
    }
  });

  if (fixes > 0) {
    fs.writeFileSync(filePath, $.html(), "utf8");
    console.log(`✅ Updated ${filePath} (${fixes} fix${fixes === 1 ? "" : "es"})`);
  } else {
    console.log(`ℹ️ No changes in ${file}`);
  }
}
