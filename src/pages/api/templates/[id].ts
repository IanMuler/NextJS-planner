import Template, { ITemplate } from "models/Template";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/client";
import { dbConnect } from "utils/mongoose";

dbConnect();

export default async function TemplateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { id },
  } = req;

  switch (method) {
    case "DELETE":
      try {
        //get the id from the query string
        const template: HydratedDocument<ITemplate> =
          await Template.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: template });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
}
