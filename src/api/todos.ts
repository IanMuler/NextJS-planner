// src/api/todos.ts
import { Todo } from "context/todos/state";
import client from "./client";

interface ITodosResponse {
  data: {
    data: Todo[];
    success: boolean;
  };
}

interface ITodoResponse {
  data: {
    data: Todo;
    success: boolean;
  };
}

export const get_todos = async (): Promise<ITodosResponse["data"]> => {
  const response: ITodosResponse = await client.get("/api/todos");
  return response.data;
};

export const add_todo = async (todo: Todo): Promise<ITodoResponse["data"]> => {
  const response: ITodoResponse = await client.post("/api/todos", todo);
  return response.data;
};

export const add_todos = async (
  todos: Todo[]
): Promise<ITodosResponse["data"]> => {
  const response: ITodosResponse = await client.post("/api/todos", todos);
  return response.data;
};

export const delete_todo = async (
  id: Todo["_id"]
): Promise<ITodoResponse["data"]> => {
  const response: ITodoResponse = await client.delete(`/api/todos/${id}`);
  return response.data;
};

export const delete_todos = async (
  ids: Todo["_id"][]
): Promise<ITodosResponse["data"]> => {
  const response: ITodosResponse = await client.delete("/api/todos", {
    data: { ids },
  });
  return response.data;
};

export const update_todo = async (
  id: Todo["_id"],
  changes: Partial<Todo>
): Promise<ITodoResponse["data"]> => {
  const response: ITodoResponse = await client.patch(
    `/api/todos/${id}`,
    changes
  );
  return response.data;
};

export const update_todos = async (todos: Todo[]) => {
  const response: ITodosResponse = await client.patch("/api/todos", todos);
  return response.data;
};
