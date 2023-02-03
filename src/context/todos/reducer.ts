import {
  UPDATE_TODO,
  DELETE_TODO,
  SET_TODOS,
  ADD_TODO,
  DELETE_TODOS,
  UPDATE_TODOS,
} from "../types";
import { ITodosState, Todo } from "./state";

export interface ITodosAction {
  type: string;
  payload:
    | Todo
    | Todo["_id"]
    | Todo["_id"][]
    | ITodosState["todos"]
    | { todo: Todo; destination: number }
    | {
        id: Todo["_id"] | Todo["draggableId"] | Todo["from_id"];
        changes: Partial<Todo>;
      };
}

export default function reducer(state: ITodosState, action: ITodosAction) {
  const { payload, type } = action;

  switch (type) {
    case SET_TODOS:
      const todos = payload as Todo[];
      return {
        ...state,
        todos,
      };

    case ADD_TODO:
      const todo_add = payload as Todo;

      const ordered_todos = [...state.todos, todo_add].sort(
        (a, b) => a.order - b.order
      );

      return {
        ...state,
        todos: ordered_todos,
      };

    case DELETE_TODO:
      const id = payload as Todo["_id"];
      const new_todos = state.todos.filter(
        (todo) => todo._id !== id && todo.from_id !== id
      );

      //new_todos must have at least one todo with start = null
      //to refresh the start generator function
      if (new_todos.length > 0) new_todos[0].start = null;

      return {
        ...state,
        todos: new_todos,
      };

    case UPDATE_TODO:
      const upd_data = payload as {
        id: Todo["_id"] | Todo["draggableId"];
        changes: Partial<Todo>;
      };
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo._id === upd_data.id || todo.draggableId === upd_data.id) {
            return { ...todo, ...upd_data.changes };
          }
          return todo;
        }),
      };

    case DELETE_TODOS:
      const ids = payload as Todo["_id"][];
      const todos_del = state.todos.filter((todo) => !ids.includes(todo._id));

      return {
        ...state,
        todos: todos_del,
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
