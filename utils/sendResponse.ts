import { NextApiResponse } from "next";

const sendResponse = (
  res: NextApiResponse,
  statusCode: number,
  result?: string | object
) => {
  res.statusCode = statusCode;
  if (!result) return res.end();
  else if (typeof result === "object") return res.json(result);
  else if (typeof result === "string") return res.send(result);
};
export default sendResponse;
