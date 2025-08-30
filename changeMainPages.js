const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// --- Usage ---
// node update.js

const folderName = __dirname; // current folder where script is

const styleBlock = `
<style>
    .custom_div_flex {
        display: flex;
        flex-direction: column;
        width: 30%;
        text-align: center;
        margin-top: 3%;
    }

    .custome_image_class {
        width: 200px;
        border: solid 1px lightgray;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .custom_d_flex {
        width: 90%;
        margin: 0 auto;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    /* .headbar {
height: 150px;
margin-top: 150px;
} */

    @media only screen and (max-width: 800px) {
        .headbar {
            height: 90px;
            /* margin-top: -90px; */
        }

        .custome_image_class {
            width: 100%;
        }
    }

@media (min-width: 800px) and (max-width: 1200px) {
  .headbar {
    height: 120px;
    /* margin-top: -90px; */
  }
}

@media (min-width: 1200px) and (max-width: 1650px) {
  .part-decl {
    margin-left: 200px;
  }
}

@media (min-width: 1200px) and (max-width: 1311px) {
  .headbar {
    height: 120px;
    /* margin-top: 220px; */
  }
}

 .headbar {
height: 150px;
/* margin-top: 150px; */
}
   @media only screen and (max-width: 800px) {
        .productDescrription {
            flex-direction: column;
            width: 100%;
        }

        .generatedImage,
        .description {
            width: 90%;
            margin: 0 auto;
        }

        .description {
            margin-top: 7%;
        }

        .headbar {
            height: auto;
        }

        .headbar-title {
            top: -3px;
        }
    }
.masthead{
position: relative;
}
.mastbody{
margin-top: -150px;
}
@media (min-width: 1200px) and (max-width: 1650px) {
.part-decl {
    margin-left: 200px;
}
}

@media (min-width: 767px) and (max-width: 801px) {
    .headbar {
height: 150px;
/* margin-top: 150px; */
}
}
</style>
`;

function processFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(html, { decodeEntities: false });

  // 1) comment all <style> tags
  $("style").each((_, el) => {
    const styleHtml = $.html(el);
    $(el).replaceWith(`<!-- ${styleHtml} -->`);
  });

  // 2) add given styleBlock before </head>
  if ($("head").length) {
    $("head").append("\n" + styleBlock + "\n");
  }

  // 3) fix script src
  $("script[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src === "js/main.min_1n.js") {
      $(el).attr("src", "main.min_1n.js");
    }
  });

  fs.writeFileSync(filePath, $.html(), "utf8");
  console.log("✅ Updated:", filePath);
}

// --- Run ---
fs.readdirSync(folderName).forEach((file) => {
  if (file.endsWith(".html")) {
    processFile(path.join(folderName, file));
  }
});
