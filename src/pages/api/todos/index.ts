import Todo, { ITodo } from "models/Todo";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/client";
import { dbConnect } from "utils/mongoose";

dbConnect();

export default async function TodosHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  switch (method) {
    case "GET":
      try {
        const todos: HydratedDocument<ITodo>[] = await Todo.findAllTodos();
        res.status(200).json({ success: true, data: todos });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      if (Array.isArray(body)) {
        try {
          const todos: HydratedDocument<ITodo>[] = await Todo.insertMany(body);
          res.status(201).json({ success: true, data: todos });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      } else {
        try {
          const todo: HydratedDocument<ITodo> = new Todo(body);
          const saved_todo = await todo.save();
          res.status(201).json({ success: true, data: saved_todo });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      }
    case "PATCH":
      try {
        const todos: ITodo[] = body;
        //Use bulkWrite to update multiple documents at once
        //bulkWrite don't return the updated documents, so we need to query them again
        await Todo.bulkWrite(
          todos.map((todo) => ({
            updateOne: {
              filter: { _id: todo._id },
              update: { $set: { ...todo } },
            },
          }))
        );

        const updatedTodos: HydratedDocument<ITodo>[] =
          await Todo.findAllTodos();

        res.status(200).json({ success: true, data: updatedTodos });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const ids: Schema.Types.ObjectId[] = body.ids;
        await Todo.deleteMany({ _id: { $in: ids } });
        const deletedTodos: HydratedDocument<ITodo>[] =
          await Todo.findAllTodos();

        res.status(200).json({ success: true, data: deletedTodos });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
}
