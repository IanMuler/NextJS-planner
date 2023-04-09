import Task, { ITask } from "models/Task";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "utils/mongoose";

dbConnect();

export default async function TasksHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      try {
        const tasks: HydratedDocument<ITask>[] = await Task.findAllTasks(
          query.user as string
        );
        res.status(200).json({ success: true, data: tasks });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case "POST":
      try {
        const task: HydratedDocument<ITask> = new Task(body);
        await task.save();
        res.status(201).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case "PATCH":
      try {
        const tasks: ITask[] = body;

        const updatePromises = tasks.map((task) =>
          Task.updateOne({ _id: task._id }, { $set: { ...task } })
        );
        await Promise.all(updatePromises);

        const updatedTasks: HydratedDocument<ITask>[] = await Task.findAllTasks(
          tasks[0].user
        );

        res.status(200).json({ success: true, data: updatedTasks });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
}
