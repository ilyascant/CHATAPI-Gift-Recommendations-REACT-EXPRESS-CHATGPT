process.setMaxListeners(15);

const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { fetchAmazonProducts, fetchTrendyolProducts, fetchTrendyolProductImages } = require("./controller/linkGetter");
const path = require("path");
const puppeteer = require("puppeteer");
const OpenAI = require("openai");
const isLoggedIn = require("./middleware/isLoggedIn");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json({ extended: false }));

const delay = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));

app.post("/api/login", async (req, res) => {
  const password = req.body?.password;
  if (password) {
    if (password === process.env.PASSWORD) {
      return res.json("correct");
    }
  } else return res.status(400).json({ error: "Couldn't get password" });
});

app.post("/api/chatapi", isLoggedIn, async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY, dangerouslyAllowBrowser: true });
  let response;
  if (req.body?.messages) {
    try {
      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
        messages: req.body.messages,
        temperature: 1,
        // temperature: req.body?.temp || 0.8,
      });

      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
});

app.post("/api/chatapi/recommendation", isLoggedIn, async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY, dangerouslyAllowBrowser: true });
  let response;
  if (req.body?.messages) {
    try {
      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
        messages: req.body.messages,
        temperature: 1,
        // temperature: req.body?.temp || 0.8,
      });

      return res.json(response);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
});

app.post("/api/scrape", isLoggedIn, async (req, res) => {
  let searchQueries = req.body?.data;
  if (!searchQueries) return res.status(400).json({ error: "Missing or invalid data in the request body." });
  searchQueries = searchQueries.map((el) => el.isim);

  const result = [];
  for (let i = 0; i < searchQueries.length; i++) {
    result.push(await fetchTrendyolProducts(searchQueries[i]));
    if (i < searchQueries.length - 1) await delay(250);
  }
  res.json(result);
});

app.get("/api/stream-images", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let searchQueries = JSON.parse(req.query?.data);
  if (!searchQueries) return res.status(400).json({ error: "Missing or invalid data in the request body." });
  searchQueries = searchQueries.map((el) => el.isim);

  const browser = await puppeteer.launch({
    args: ["--disable-setuid-sandbox", "--no-sandbox", "--single-process", "--no-zygote"],
    executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();
  for (let i = 0; i < searchQueries.length; i++) {
    const data = await fetchTrendyolProductImages(page, searchQueries[i]);
    if (data.length > 0) {
      res.write(`${JSON.stringify(data)}`);
    }
    if (i < searchQueries.length - 1) await delay(250);
  }

  res.end();
});

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use((err, req, res, next) => {
  const errorMsg = err.message || "Something Went Wrong";
  return res.status(500).json({
    succes: false,
    message: errorMsg,
    stack: err.stack,
  });
});

app.listen(PORT, () => console.log(`Server is Running On PORT: ${PORT}`));

module.exports = app;
