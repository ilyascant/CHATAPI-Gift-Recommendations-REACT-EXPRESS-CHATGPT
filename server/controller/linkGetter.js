const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const delay = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));

const fetchAmazonProducts = async (searchQuery) => {
  const TAGS = "&linkCode=ll1&tag=raducat-20&ref_=as_li_ss_tl";
  const REGEX = /.*(\/[A-Z0-9]+)/gm;

  const PAGE_URL = `https://www.amazon.com/s?k=${searchQuery.replace(" ", "+")}`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(PAGE_URL);
  await delay(1000);

  const html = await page.content();

  await browser.close();
  const $ = cheerio.load(html);
  const products = [];

  $(".s-widget-container").each((i, element) => {
    const titleElement = $(element).find(".s-title-instructions-style .s-link-style");
    const priceElement = $(element).find(".a-price > span").first();

    const title = titleElement.text();
    const price = parseInt(priceElement.text().replace(/[$,]/g, ""), 10);
    let link = titleElement.attr("href");

    if (!title || !link || isNaN(price)) {
      return;
    }
    link = link.match(REGEX);

    products.push({
      title,
      price,
      priceInDollarFormat: priceElement.text(),
      link: `https://www.amazon.com${link}?${TAGS}`,
    });
  });

  return products;
};

const fetchTrendyolProducts = async (page, searchQuery) => {
  const TAGS = "";
  const REGEX = /.*(\/[A-Z0-9]+)/gm;

  const PAGE_URL = `https://www.trendyol.com/sr?q=${searchQuery.replace(" ", "+")}`;

  // const response = await axios.get(PAGE_URL);
  // const $ = cheerio.load(response.data);

  // const browser = await puppeteer.launch({ headless: "new" });

  const products = [];
  try {
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    const html = await page.content();

    // await browser.close();
    const $ = cheerio.load(html);

    $(".p-card-wrppr").each((i, element) => {
      if (products.length >= 6) return false;

      const titleElement = $(element).find(".prdct-desc-cntnr-ttl");
      const descElement = $(element).find(".prdct-desc-cntnr-name");
      const priceElement = $(element).find(".prc-box-dscntd").first();
      const linkElement = $(element).find(".p-card-chldrn-cntnr > a").first();
      const imageElement = $(element).find(".p-card-img").first();

      const title = titleElement.text().toUpperCase() + " - " + descElement.text();
      const price = parseInt(priceElement.text().replace(/[TL.]/g, ""), 10);
      const image = imageElement.attr("src");
      let link = linkElement.attr("href");

      if (!title || !link || isNaN(price)) {
        return;
      }
      // link = link.match(REGEX);

      products.push({
        title,
        price,
        priceInDollarFormat: priceElement.text(),
        link: `https://www.trendyol.com${link}?${TAGS}`,
        image,
      });
    });
  } catch (error) {}
  return products;
};

module.exports = { fetchAmazonProducts, fetchTrendyolProducts };
