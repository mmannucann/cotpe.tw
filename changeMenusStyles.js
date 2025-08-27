// changeStyles.js
const fs = require("fs");
const path = require("path");

const dirPath = __dirname; // current folder

// --- CSS blocks we need to ensure ---
const media800_1200 = `@media (min-width: 800px) and (max-width: 1200px) {
  .headbar {
    height: 120px;
    margin-top: -90px;
  }
}`;
const media1200_1650 = `@media (min-width: 1200px) and (max-width: 1650px) {
  .part-decl {
    margin-left: 200px;
  }
}`;
const media1200_1311 = `@media (min-width: 1200px) and (max-width: 1311px) {
  .headbar {
    height: 120px;
    margin-top: 220px;
  }
}`;

// --- functions ---
function ensureCSS(html, cssBlock) {
  if (html.includes(cssBlock)) return html;

  const styleClose = html.lastIndexOf("</style>");
  if (styleClose !== -1) {
    return html.slice(0, styleClose) + "\n" + cssBlock + "\n" + html.slice(styleClose);
  } else {
    return html + `\n<style>\n${cssBlock}\n</style>\n`;
  }
}

function fixHeadbar150(html) {
  return html.replace(
    /\.headbar\s*{\s*height\s*:\s*150px\s*;?\s*}/gi,
    ".headbar {\n    height: 150px;\n    margin-top: 150px;\n}"
  );
}

function fixHeadbar90InsideMedia(html) {
  return html.replace(
    /(@media[^{]*max-width:\s*800px[^{]*{\s*[^}]*\.headbar\s*{[^}]*height\s*:\s*90px\s*;?)([^}]*})/gi,
    (match, p1, p2) => {
      if (/margin-top\s*:\s*-90px/.test(match)) return match; // already added
      return `${p1}\n    margin-top: -90px;${p2}`;
    }
  );
}

function addPartDeclClass(html) {
  return html.replace(
    /(<span\s+class="navbar-link-txt">)\s*Participation\s+Declaration\s*(<\/span>)/gi,
    `<span class="navbar-link-txt part-decl">Participation Declaration</span>`
  );
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  content = fixHeadbar150(content);
  content = fixHeadbar90InsideMedia(content);

  content = ensureCSS(content, media800_1200);
  content = ensureCSS(content, media1200_1650);
  content = ensureCSS(content, media1200_1311);

  content = addPartDeclClass(content);

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  } else {
    console.log(`ℹ️ No changes: ${path.basename(filePath)}`);
  }
}

// Run for all .html files in this folder
fs.readdirSync(dirPath).forEach((name) => {
  const full = path.join(dirPath, name);
  if (fs.statSync(full).isFile() && name.toLowerCase().endsWith(".html")) {
    processFile(full);
  }
});

console.log("🎉 Done.");
