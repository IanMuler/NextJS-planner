import { Task } from "context/tasks/state";
import {
  UPDATE_TODO,
  DELETE_TODO,
  GET_TODOS,
  ADD_TODO,
  UPDATE_TODOS,
} from "../types";
import { ITodosState, Todo } from "./state";

export interface ITodosAction {
  type: string;
  payload:
    | Task
    | Todo["id"]
    | ITodosState["todos"]
    | { todo: Todo; destination: number }
    | { id: Todo["id"]; changes: Partial<Todo> };
}

export default function reducer(state: ITodosState, action: ITodosAction) {
  const { payload, type } = action;

  switch (type) {
    case GET_TODOS:
      const todos = payload as Todo[];
      return {
        ...state,
        todos,
      };

    case ADD_TODO:
      const todo_add = payload as { todo: Todo; destination: number };

      const ordered_todos = state.todos;
      ordered_todos.splice(todo_add.destination, 0, todo_add.todo);

      return {
        ...state,
        todos: ordered_todos,
      };

    case DELETE_TODO:
      const id = payload as Todo["id"];
      const new_todos = state.todos.filter(
        (todo) => todo.id !== id && todo.from_id !== id
      );

      //new_todos must have at least one todo with start = null
      //to refresh the start generator function
      new_todos[0].start = null;

      return {
        ...state,
        todos: new_todos,
      };

    case UPDATE_TODO:
      //"update todo" could be call editing a task or a todo, so we need accept "id" and "from_id",
      // and we need to update all the todos that have the same id or from_id
      const upd_data = payload as { id: Todo["id"]; changes: Partial<Todo> };

      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === upd_data.id || todo.from_id === upd_data.id) {
            return { ...todo, ...upd_data.changes };
          }
          return todo;
        }),
      };

    case UPDATE_TODOS:
      const todos_upd = payload as Todo[];
      return {
        ...state,
        todos: todos_upd,
      };

    default:
      return state;
  }
}
