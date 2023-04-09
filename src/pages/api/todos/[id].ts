import Todo, { ITodo } from "models/Todo";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/client";
import { dbConnect } from "utils/mongoose";

dbConnect();

export default async function TodoHandler(
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
        const todo: HydratedDocument<ITodo> = await Todo.findByIdAndUpdate(
          id,
          body,
          { new: true }
        );
        res.status(200).json({ success: true, data: todo });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case "DELETE":
      try {
        //get the id from the query string
        const todo: HydratedDocument<ITodo> = await Todo.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: todo });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
}
