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
        console.log(await chromium.executablePath);
        browser = await chromium.puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath:
            (await chromium.executablePath) ?? "/usr/bin/google-chrome-stable",
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        });
        console.log("Abriu o chromez");
      }
      let page = await browser.newPage();
      console.log("Pagina Abriu");
      await page.setRequestInterception(true);
      new Promise((resolve, reject) => {
        page.on("request", async (req) => {
          try {
            const type = req.resourceType();
            if (type === "media") resolve(req.url());
            if (acceptTypes.includes(type)) req.continue();
            else req.abort();
          } catch (e) {}
        });
        setTimeout(reject, timer * 1000);
      })
        .then(async (src) => {
          console.log("Vídeo encontrado");
          if (!!src) {
            await firestore.collection("video").doc(path).set({
              currentTime: 0,
              date: Date.now(),
              src,
              play: false,
            });
            statusCode = 200;
          } else statusCode = 404;
        })
        .catch(() => (statusCode = 404))
        .finally(() => page.close().then((e) => console.log("Página Fechou")));
      await page.goto(url);
    }
    statusCode = 400;
  } catch (error) {
    statusCode = 500;
    // console.error(error);
  } finally {
    res.statusCode = statusCode;
    res.end();
  }
};

process.on("beforeExit", () =>
  browser.close().then(() => console.log("Fechou"))
);
