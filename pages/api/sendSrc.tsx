import chromium from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import { Browser, Page } from "puppeteer-core";
import { firestore } from "../../config/fire";
import sendResponse from "../../utils/sendResponse";

let browser: Browser | null = null;

const notAcceptedTypes = ["stylesheet", "image", "font"];
const pageOtimization = async (page: Page) => {
  page.setRequestInterception(true);
  page.on("request", (req) => {
    let type = req.resourceType();
    if (notAcceptedTypes.includes(type)) req.failure();
    else req.continue();
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url, path } = req.body;
    if (url && path) {
      if (!browser) {
        console.log(await chromium.executablePath);
        browser = await chromium.puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath:
            (await chromium.executablePath) ??
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          ignoreHTTPSErrors: true,
        });
        console.log("Abriu o chrome");
      }
      let page = await browser.newPage();
      await pageOtimization(page);
      console.log("Pagina Abriu");
      await page.goto(url);
      await page.waitForSelector("video");
      const src = await page.$eval("video", (e: HTMLVideoElement) => e.src);
      if (!src) {
        console.log("Não achou vídeo");
        return sendResponse(res, 400);
      }
      await firestore.collection("video").doc(path).set({
        src,
        currentTime: 0,
        date: Date.now(),
        play: false,
      });
      console.log("Achou vídeo");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return sendResponse(res, 200, "OK");
    }
    return sendResponse(res, 400);
  } catch (e) {
    return sendResponse(res, 500);
  }
};
