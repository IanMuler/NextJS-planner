// src/api/tasks.ts
import { Task } from "context/tasks/state";
import client from "./client";

interface ITasksResponse {
  data: {
    data: Task[];
    success: boolean;
  };
}

interface ITaskResponse {
  data: {
    data: Task;
    success: boolean;
  };
}

export const get_tasks = async (): Promise<ITasksResponse["data"]> => {
  const response: ITasksResponse = await client.get("/api/tasks");
  return response.data;
};

export const update_tasks = async (tasks: Task[]) => {
  const response: ITasksResponse = await client.patch("/api/tasks", tasks);
  return response.data;
};

export const add_task = async (task: Task): Promise<ITaskResponse["data"]> => {
  const response: ITaskResponse = await client.post("/api/tasks", task);
  return response.data;
};

export const update_task = async (id: Task["_id"], changes: Partial<Task>) => {
  const response: ITaskResponse = await client.patch(
    `/api/tasks/${id}`,
    changes
  );
  return response.data;
};

export const delete_task = async (id: Task["_id"]) => {
  const response: ITaskResponse = await client.delete(`/api/tasks/${id}`);
  return response.data;
};
