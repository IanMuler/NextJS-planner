import Task, { ITask } from "models/Task";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/client";
import { dbConnect } from "utils/mongoose";

dbConnect();

export default async function TaskHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { id },
  } = req;

  switch (method) {
    case "PATCH":
      try {
        const task: HydratedDocument<ITask> = await Task.findByIdAndUpdate(
          id,
          body,
          { new: true }
        );
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        //get the id from the query string
        const task: HydratedDocument<ITask> = await Task.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
}
