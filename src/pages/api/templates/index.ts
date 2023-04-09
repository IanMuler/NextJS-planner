import Template, { ITemplate } from "models/Template";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/client";
import { dbConnect } from "utils/mongoose";

dbConnect();

export default async function TemplatesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;
  switch (method) {
    case "GET":
      try {
        const templates: HydratedDocument<ITemplate>[] =
          await Template.findAllTemplates(query.user as string);
        res.status(200).json({ success: true, data: templates });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    case "POST":
      try {
        const template: HydratedDocument<ITemplate> = new Template(body);
        const saved_template = await template.save();
        res.status(201).json({ success: true, data: saved_template });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
}
