import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../config/fire";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url, path } = req.body;
    if (url && path) {
      console.log(req.body);
      firestore
        .collection("video")
        .doc(path)
        .set({ src: url, currentTime: 0, date: Date.now(), play: false });
      res.status(200).send("OK");
    }
    res.status(400).end();
  } catch (error) {
    res.status(500).end();
  }
};
