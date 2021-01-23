import { rejects } from "assert";
import chromium from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import { Browser, Page } from "puppeteer-core";
import { firestore } from "../../config/fire";
let browser: Browser | null = null;

const timer = 5; //in sec
const acceptTypes = ["document", "fetch", "script", "xhr", "media"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let statusCode = 400;
  try {
    const { url, path } = req.body;
    if (url && path) {
      if (!browser) {
        browser = await chromium.puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath:
            (await chromium.executablePath) ??
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        });
      }
      let page = await browser.newPage();
      console.log("Pagina Abriu");
      await page.setRequestInterception(true);
      new Promise((resolve) => {
        page.on("request", (req) => {
          const type = req.resourceType();
          if (type === "media") resolve(req.url());
          if (acceptTypes.includes(type)) req.continue();
          else req.abort();
        });
      })
        .then((src) => {
          console.log(src);
          if (!!src)
            firestore.collection("video").doc(path).set({
              currentTime: 0,
              date: Date.now(),
              src,
              play: false,
            });
        })
        .finally(() => page.close());
      await page.goto(url);
    }
    statusCode = 200;
  } catch (error) {
    statusCode = 500;
    console.error(error);
  } finally {
    res.statusCode = statusCode;
    res.end();
  }
};

process.on("beforeExit", () =>
  browser.close().then(() => console.log("Fechou"))
);
