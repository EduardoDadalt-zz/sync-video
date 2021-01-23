import { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { Page } from "puppeteer";
import { firestore } from "../../config/fire";

const getSrc = (page: Page, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const type = req.resourceType();

        const acepptTypes = ["font", "image", "stylesheet"];
        if (type === "media") resolve(req.url());
        if (!acepptTypes.includes(type)) return req.continue();
        else return req.abort();
      });
      await page.goto(url);
      setTimeout(reject, 4000);
    } catch (error) {
      reject();
    }
  });
};

const getVideoOfLink = async (url: string) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    const src = await getSrc(page, url);

    browser.close().then((e) => console.log("Browser Close"));
    return src;
  } catch (error) {
    browser.close().then((e) => console.log("Browser Close"));
    return "";
  }
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url, path } = req.body;

    const src = await getVideoOfLink(url);
    if (!!src && !!path) {
      firestore.collection("video").doc(path).set({
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
