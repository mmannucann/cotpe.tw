const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// --- Usage ---
// node update_html.js folderName

if (process.argv.length < 3) {
  console.log("Usage: node update_html.js <folderName>");
  process.exit(1);
}

const folderName = process.argv[2];

const styleCode = `
<style>
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
</style>
`;

const headerReplacement = `
    <header class="masthead">
        <div class="masthead-inner">
            <div class="masthead-logo">
                <a class="masthead-logo-img" href="../index.html" title="Homepage">
                    <img fetchpriority="high" width="142" height="32" src="../img/ui/header-logo.png" alt="Taiwanese Cultural Program at the Paris Olympics">
                </a>
            </div>
            <nav class="navbar" aria-label="Site">
                <div class="navbar-item"> <a class="navbar-link part-decl" href="../about.html"> <span class="navbar-link-txt part-decl">Participation
                            Declaration</span> <span class="navbar-link-underline bg-blue"></span> </a> </div>
                <div class="navbar-item"> <a class="navbar-link" href="../venue.html"> <span class="navbar-link-txt">Taiwan
                            Pavilion</span> <span class="navbar-link-underline bg-yellow"></span> </a> </div>
                <div class="navbar-item"> <a class="navbar-link" href="../performing-arts.html" js-panel-btn="subnav-exhibit" aria-controls="subnav-exhibit" aria-owns="subnav-exhibit"> <span class="navbar-link-txt">Cultural
                            Exhibition</span> <span class="navbar-link-underline bg-dark"></span> </a> </div>
                <div class="subnav" id="subnav-exhibit" js-panel="subnav-exhibit">
                    <div class="subnav-inner">
                        <ul class="subnav-row">
                            <li class="subnav-item"> <a class="subnav-link" href="../performing-arts.html"> <span class="subnav-link-txt">Performing-Arts Series</span> </a> </li>
                            <li class="subnav-item"> <a class="subnav-link" href="../taiwan-customs.html"> <span class="subnav-link-txt">Visual-Art Series</span> </a> </li>
                        </ul>
                    </div> <span tabindex="0" class="tabclose" aria-hidden="true"></span>
                </div>
                <div class="navbar-item"> <a class="navbar-link" href="../program.html"> <span class="navbar-link-txt">Program</span>
                        <span class="navbar-link-underline bg-red"></span> </a> </div>
                <div class="navbar-item"> <a class="navbar-link" href="../credits.html"> <span class="navbar-link-txt">All
                            Members</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../utility-bill.html"> <span class="navbar-link-txt">Utility
                            bill</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../business-utility-bill.html"> <span class="navbar-link-txt">Business utility bill</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item active"> <a class="navbar-link" href="../bank-statement.html"> <span class="navbar-link-txt">Bank
                            statement</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../business-bank-statement.html"> <span class="navbar-link-txt">Business bank statement</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../mortgage-statement.html"> <span class="navbar-link-txt">Mortgage statement</span> <span class="navbar-link-underline bg-primary"></span>
                    </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../passport.html"> <span class="navbar-link-txt">Passport</span>
                        <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../passport-photolook.html"> <span class="navbar-link-txt">Passport photolook</span> <span class="navbar-link-underline bg-primary"></span>
                    </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../driving-license.html"> <span class="navbar-link-txt">Driving
                            license</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../driving-license-photolook.html"> <span class="navbar-link-txt">Driving license photolook</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../ID-card.html"> <span class="navbar-link-txt">ID
                            card</span>
                        <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../ID-card-photolook.html"> <span class="navbar-link-txt">ID
                            card photolook</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item"> <a class="navbar-link" href="../certificate.html"> <span class="navbar-link-txt">Certificate</span> <span class="navbar-link-underline bg-primary"></span> </a>
                </div>
                <div class="navbar-item "> <a class="navbar-link" href="../travel-visa.html"> <span class="navbar-link-txt">Travel
                            visa</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../credit-card.html"> <span class="navbar-link-txt">Credit
                            card</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../mix.html"> <span class="navbar-link-txt">Mix</span> <span class="navbar-link-underline bg-primary"></span>
                    </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../residence-permit.html"> <span class="navbar-link-txt">Residence permit</span> <span class="navbar-link-underline bg-primary"></span>
                    </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../residence-permit-photolook.html"> <span class="navbar-link-txt">Residence permit photolook</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../reference.html"> <span class="navbar-link-txt">Reference</span> <span class="navbar-link-underline bg-primary"></span> </a>
                </div>
                <div class="navbar-item "> <a class="navbar-link" href="../invoice.html"> <span class="navbar-link-txt">Invoice</span>
                        <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../paystub.html"> <span class="navbar-link-txt">Paystub</span>
                        <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../business-registration-certificate.html"> <span class="navbar-link-txt">Business registration certificate</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../credit-card-photolook.html"> <span class="navbar-link-txt">Credit card photolook</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../car-title.html"> <span class="navbar-link-txt">Car
                            title</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../health-insurance-card.html"> <span class="navbar-link-txt">Health insurance card</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../ssn.html"> <span class="navbar-link-txt">SSN</span> <span class="navbar-link-underline bg-primary"></span>
                    </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../mix-photolook.html"> <span class="navbar-link-txt">Mix
                            photolook</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
                <div class="navbar-item "> <a class="navbar-link" href="../payment-receipt.html"> <span class="navbar-link-txt">Payment
                            Receipt</span> <span class="navbar-link-underline bg-primary"></span> </a> </div>
            </nav>
            <div class="masthead-service"> <a class="masthead-btn-lang btn btn-sm rounded-pill border-gray lh-sm text-gray" href="javascript:;" js-panel-btn="langsel" role="button" aria-controls="masthead-langsel" aria-owns="masthead-langsel" aria-label="Select language"> <i class="ico-ui-globe"></i> <small class="txt">En</small> </a> </div>
            <nav class="masthead-langsel" id="masthead-langsel" js-panel="langsel" tabindex="0" aria-label="Language">
                <a class="btn btn-sm text-white on" href="../index.html">English</a> <a class="btn btn-sm text-white " href="../fr.html">Français</a> <a class="btn btn-sm text-white " href="../tw.html">中文</a> <span tabindex="0" class="tabclose" aria-hidden="true"></span>
            </nav> <a class="masthead-toggle" href="javascript:;" js-panel-btn="mbpanel" role="button" aria-controls="mbpanel" aria-label="Open mobile navigation panel"><i></i><i></i><i></i></a>
        </div>
        <div class="mbpanel" id="mbpanel" js-panel="mbpanel">
            <div class="mbpanel-inner">
                <nav class="mbpanel-col" aria-label="Mobile site">
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../about.html">
                            <span class="mbpanel-link-txt">Participation Declaration</span>
                            <span class="mbpanel-link-underline bg-yellow"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../venue.html">
                            <span class="mbpanel-link-txt">Taiwan Pavilion</span>
                            <span class="mbpanel-link-underline bg-blue"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item" js-foldable-group="">
                        <a class="mbpanel-link" href="../performing-arts.html" js-foldable-head="" aria-controls="mbpanel-sub-exhibit" aria-owns="mbpanel-sub-exhibit">
                            <span class="mbpanel-link-txt">Cultural Exhibition</span>
                            <i class="mbpanel-link-ico ico-ui-down-v"></i>
                            <span class="mbpanel-link-underline bg-dark"></span>
                        </a>
                        <div class="mbpanel-sub" id="mbpanel-sub-exhibit" js-foldable-body="">
                            <div class="mbpanel-subitem">
                                <a class="mbpanel-sublink" href="../performing-arts.html">
                                    <span class="mbpanel-sublink-txt">Performing-Arts Series</span>
                                </a>
                            </div>
                            <div class="mbpanel-subitem">
                                <a class="mbpanel-sublink" href="../taiwan-customs.html">
                                    <span class="mbpanel-sublink-txt">Visual-Art Series</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../program.html">
                            <span class="mbpanel-link-txt">Program</span>
                            <span class="mbpanel-link-underline bg-primary"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../credits.html">
                            <span class="mbpanel-link-txt">All Members</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../utility-bill.html">
                            <span class="mbpanel-link-txt">Utility bill</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../business-utility-bill.html">
                            <span class="mbpanel-link-txt">Business utility bill</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../bank-statement.html">
                            <span class="mbpanel-link-txt">Bank statement</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../business-bank-statement.html">
                            <span class="mbpanel-link-txt">Business bank statement</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../mortgage-statement.html">
                            <span class="mbpanel-link-txt">Mortgage statement</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../passport.html">
                            <span class="mbpanel-link-txt">Passport</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../passport-photolook.html">
                            <span class="mbpanel-link-txt">Passport photolook</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../driving-license.html">
                            <span class="mbpanel-link-txt">Driving license</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../driving-license-photolook.html">
                            <span class="mbpanel-link-txt">Driving license photolook</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../ID-card.html">
                            <span class="mbpanel-link-txt">ID card</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../ID-card-photolook.html">
                            <span class="mbpanel-link-txt">ID card photolook</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../certicate.html">
                            <span class="mbpanel-link-txt">Certificate</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../travel-visa.html">
                            <span class="mbpanel-link-txt">Travel visa</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../credit-card.html">
                            <span class="mbpanel-link-txt">Credit card</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../mix.html">
                            <span class="mbpanel-link-txt">Mix</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../residence-permit.html">
                            <span class="mbpanel-link-txt">Residence permit</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>
                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../residence-permit-photolook.html">
                            <span class="mbpanel-link-txt">Residence permit photolook</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../reference.html">
                            <span class="mbpanel-link-txt">Reference</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../invoice.html">
                            <span class="mbpanel-link-txt">Invoice</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../paystub.html">
                            <span class="mbpanel-link-txt">Paystub</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../business-registration-certificate.html">
                            <span class="mbpanel-link-txt">Business registration certificate</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../credit-card-photolook.html">
                            <span class="mbpanel-link-txt">Credit card photolook</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../car-title.html">
                            <span class="mbpanel-link-txt">Car title</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../health-insurance-card.html">
                            <span class="mbpanel-link-txt">Health insurance card</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../ssn.html">
                            <span class="mbpanel-link-txt">SSN</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../mix-photolook.html">
                            <span class="mbpanel-link-txt">Mix photolook</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>

                    <div class="mbpanel-item">
                        <a class="mbpanel-link" href="../payment-receipt.html">
                            <span class="mbpanel-link-txt">Payment Receipt</span>
                            <span class="mbpanel-link-underline bg-red"></span>
                        </a>
                    </div>


                </nav>
                <nav class="mbpanel-service">
                    <div class="mbpanel-langsel d-flex justify-content-center align-items-center">
                        <i class="ico-ui-globe"></i>
                        <a class="btn btn-sm mr-n3 on" href="../index.html">En</a>
                        <a class="btn btn-sm mr-n3" href="../fr.html">Fr</a>
                        <a class="btn btn-sm mr-n3" href="../tw.html">中文</a>
                    </div>
                    <div class="mbpanel-social d-flex justify-content-center align-items-center">
                        <a class="btn btn-dark btn-social-circle ml-3" rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/www.moc.gov.tw" alt="Facebook"><i class="ico-ui-facebook"></i></a>
                        <a class="btn btn-dark btn-social-circle ml-3" rel="noopener noreferrer" target="_blank" href="https://twitter.com/culturaltaiwan" alt="X"><i class="ico-ui-x small"></i></a>
                        <a class="btn btn-dark btn-social-circle ml-3" rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/moc_taiwan/" alt="Instagram"><i class="ico-ui-instagram"></i></a>
                        <a class="btn btn-dark btn-social-circle ml-3" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/user/mocnews0520" alt="Youtube channel"><i class="ico-ui-youtube"></i></a>
                    </div>
                </nav>
            </div>
        </div>
    </header>
`;

function processFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(html);

  // 1) fix script src
  $("script[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src && src.includes("../js/main.min_1n.js")) {
      $(el).attr("src", "../main.min_1n.js");
    }
  });

  // 2) first nav.navbar > div.navbar-item → add part-decl
  const nav = $("nav.navbar").first();
  if (nav.length) {
    const firstDiv = nav.find("div.navbar-item").first();
    if (firstDiv.length && !firstDiv.hasClass("part-decl")) {
      firstDiv.addClass("part-decl");
    }
  }

  // 3) add style tag before <head>
  if ($("head").length) {
    $("head").append(styleCode);
  }

  // 4) replace header.masthead
  if ($("header.masthead").length) {
    $("header.masthead").replaceWith(headerReplacement);
  }

  fs.writeFileSync(filePath, $.html(), "utf8");
  console.log("✅ Updated:", filePath);
}

// --- Run ---
fs.readdirSync(folderName).forEach((file) => {
  if (file.endsWith(".html")) {
    processFile(path.join(folderName, file));
  }
});
