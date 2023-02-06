import Todo, { ITodo } from "models/Todo";
import { HydratedDocument, Schema } from "mongoose";
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

        const updatePromises = todos.map((todo) =>
          Todo.updateOne({ _id: todo._id }, { $set: { ...todo } })
        );
        await Promise.all(updatePromises);

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
