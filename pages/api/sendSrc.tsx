import { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { Page } from "puppeteer";
import { adminFirestore } from "../../config/adminFB";

const otimizationPage = async (page: Page) => {
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const type = req.resourceType();
    const acepptTypes = ["document", "fetch", "script", "xhr", "media"];
    if (acepptTypes.includes(type)) req.continue();
    else req.abort();
  });
};
const getVideoOfLink = async (url: string) => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  try {
    const page = await browser.newPage();
    await otimizationPage(page);
    await page.goto(url);
    await page.waitForSelector("video", { timeout: 3000 });
    const src = await page.$eval("video", (el: HTMLVideoElement) => el.src);
    browser.close().then((e) => console.log("Browser Close"));
    return src;
  } catch (error) {
    console.error(error);
    browser.close().then((e) => console.log("Browser Close"));
    return "";
  }
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url, path } = req.body;
    const src = await getVideoOfLink(url);
    if (!!src && !!path) {
      adminFirestore.collection("video").doc(path).set({
        src,
        play: false,
        currentTime: 0,
        date: Date.now(),
      });
      res.statusCode = 200;
      res.send("OK");
    } else {
      res.statusCode = 400;
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end();
  }
};