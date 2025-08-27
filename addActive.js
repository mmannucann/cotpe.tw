// addActive.js (CommonJS version, updates all sibling HTML files)
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Get current folder of this script
const folderPath = __dirname;

// Read all files in folder
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error("Error reading folder:", err);
        return;
    }

    // Filter only HTML files (skip folders)
    const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === ".html");

    htmlFiles.forEach(filename => {
        const filePath = path.join(folderPath, filename);
        const html = fs.readFileSync(filePath, "utf-8");

        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Current page name = filename
        const currentPage = filename;

        // Process navbar items
        const navbarItems = document.querySelectorAll(".navbar-item");
        navbarItems.forEach(div => {
            const link = div.querySelector("a.navbar-link");
            if (link) {
                const href = link.getAttribute("href");
                if (href === currentPage) {
                    div.classList.add("active");
                } else {
                    div.classList.remove("active");
                }
            }
        });

        // Save updated HTML
        fs.writeFileSync(filePath, dom.serialize(), "utf-8");
        console.log(`Updated ${filename}`);
    });
});
