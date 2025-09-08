const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio"); // npm install cheerio

// --- STEP 0: Get folder name from arguments ---
const folderArg = process.argv[2];
if (!folderArg) {
  console.error("❌ Please provide a folder name. Example: node updateContacts.js folderforfiles");
  process.exit(1);
}

const folderPath = path.join(__dirname, folderArg);
const newHref = "https://t.me/axtempl";

// --- STEP 1: Check if folder exists ---
if (!fs.existsSync(folderPath)) {
  console.error(`❌ Folder '${folderArg}' not found.`);
  process.exit(1);
}

// --- STEP 2: Get all .html files ---
const htmlFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".html"));

if (htmlFiles.length === 0) {
  console.error("⚠️ No HTML files found in the folder.");
  process.exit(1);
}

// --- STEP 3: Process each file ---
htmlFiles.forEach(file => {
  const filePath = path.join(folderPath, file);
  const content = fs.readFileSync(filePath, "utf-8");

  const $ = cheerio.load(content);

  // Find first <p> inside div.contacts
  const pTag = $("div.contacts p").first();
  if (pTag.length) {
    const aTag = pTag.find("a").first();
    if (aTag.length) {
      aTag.attr("href", newHref);
      fs.writeFileSync(filePath, $.html(), "utf-8");
      console.log(`✅ Updated <a> in ${file}`);
    }
  }
});

console.log("🎉 All HTML files updated successfully!");
