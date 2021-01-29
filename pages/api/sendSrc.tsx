import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../config/fire";
import sendResponse from "../../utils/sendResponse";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url, path } = req.body;
    if (url && path) {
      firestore
        .collection("video")
        .doc(path)
        .set({ src: url, currentTime: 0, date: Date.now(), play: false });
      sendResponse(res, 200, "OK");
    }
    sendResponse(res, 400);
  } catch (error) {
    return sendResponse(res, 500);
  }
};
