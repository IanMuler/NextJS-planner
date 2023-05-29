import React, { createContext, useReducer } from "react";
import { SET_TODOS, UPDATE_TODO, DELETE_TODO, DELETE_TODOS } from "../types";
import reducer, { ITodosAction } from "./reducer";
import { Task } from "../tasks/state";
import { v4 } from "uuid";
import {
  add_todo,
  delete_todo,
  update_todo,
  update_todos,
  delete_todos,
  add_todos,
} from "api/todos";
import isEqual from "lodash.isequal";

export interface Todo extends Omit<Task, "assigned"> {
  start?: string;
  task: Task["_id"];
}

export interface ITodosState {
  todos: Todo[];
}

export interface ITodosContext extends ITodosState {
  setTodos: (todos: ITodosState["todos"]) => void;
  addTodo: (task: Task, destination: number) => void;
  addTodos: (todos: ITodosState["todos"]) => void;
  deleteTodo: (id: Todo["_id"]) => void;
  updateTodo: (id: Todo["_id"], changes: Partial<Todo>) => void;
  deleteTodos: (ids: Todo["_id"][]) => void;
  updateTodos: (todos: ITodosState["todos"]) => void;
}

const initialState: ITodosState = {
  todos: [],
};

const TodosContext = createContext<ITodosContext>(
  initialState as ITodosContext
);

const TodosProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer<
    React.Reducer<ITodosState, ITodosAction>
  >(reducer, initialState);

  const setTodos: ITodosContext["setTodos"] = (todos) => {
    const sortedTodos = todos.sort((a, b) => a.order - b.order);

    dispatch({ type: SET_TODOS, payload: sortedTodos });
  };

  const addTodo: ITodosContext["addTodo"] = async (task, destination) => {
    const prev_todos = [...state.todos];

    const { _id, assigned, ...rest } = task;
    const id: Todo["draggableId"] = v4();
    const todo: Todo = {
      ...rest,
      start: null,
      draggableId: id,
      task: _id,
      order: destination,
    };

    const new_todos_list = [...state.todos, todo];

    //reasign order property to every task depending on the destination of the drag
    const todos_reordered: Todo[] = new_todos_list.map((actual_todo) => {
      if (
        actual_todo.order >= destination &&
        actual_todo.draggableId !== todo.draggableId
      ) {
        actual_todo.order += 1;
      }
      return actual_todo;
    });

    const new_todos_sorted = todos_reordered.sort((a, b) => a.order - b.order);

    dispatch({ type: SET_TODOS, payload: new_todos_sorted });

    try {
      const todo_response = await add_todo(todo);
      const todo_data = todo_response.data;

      // update the todo with the new _id
      dispatch({
        type: UPDATE_TODO,
        payload: {
          id: todo_data.draggableId,
          changes: { _id: todo_data._id },
        },
      });

      // update the new todo in the new todos list to update by API
      const new_todos_sorted_updated = new_todos_sorted.map((todo) => {
        if (todo.draggableId === todo_data.draggableId) {
          return todo_data;
        }
        return todo;
      });

      if (!isEqual(new_todos_list, new_todos_sorted)) {
        await updateTodos(new_todos_sorted_updated);
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: SET_TODOS, payload: prev_todos });
    }
  };

  const addTodos: ITodosContext["addTodos"] = async (todos) => {
    const prev_todos = [...state.todos];

    try {
      const todos_response = await add_todos(todos);
      const todos_data = todos_response.data;

      dispatch({ type: SET_TODOS, payload: todos_data });
    } catch (error) {
      console.error(error);
      dispatch({ type: SET_TODOS, payload: prev_todos });
    }
  };

  const deleteTodo: ITodosContext["deleteTodo"] = async (id) => {
    const prev_todos = [...state.todos];

    const todo_del = state.todos.find(
      (todo) => todo._id === id || todo.task === id
    );

    dispatch({ type: DELETE_TODO, payload: todo_del._id });
    try {
      const todo_response = await delete_todo(todo_del._id);
      const todo_data = todo_response.data;

      if (!isEqual(todo_data, todo_del)) {
        dispatch({ type: DELETE_TODO, payload: todo_data._id });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: SET_TODOS, payload: prev_todos });
    }
  };

  const updateTodo: ITodosContext["updateTodo"] = async (id, changes) => {
    const todo_upd = state.todos.find((todo) => todo._id === id);

    try {
      const todo_response = await update_todo(todo_upd._id, changes);
      const todo_data = todo_response.data;
      dispatch({ type: UPDATE_TODO, payload: { id: todo_data._id, changes } });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodos: ITodosContext["deleteTodos"] = async (ids) => {
    const prev_todos = [...state.todos];
    const todos_del = state.todos.filter((todo) => ids.includes(todo._id));
    dispatch({
      type: DELETE_TODOS,
      payload: todos_del.map((todo) => todo._id),
    });

    try {
      const todos_response = await delete_todos(ids);
      // todos_data is an array of the current todos
      const todos_data = todos_response.data;

      if (todos_data.length > 0) {
        dispatch({ type: SET_TODOS, payload: todos_data });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: SET_TODOS, payload: prev_todos });
    }
  };

  const updateTodos: ITodosContext["updateTodos"] = async (todos) => {
    const prev_todos = [...state.todos];

    const sorted_todos = todos.sort((a, b) => a.order - b.order);
    dispatch({ type: SET_TODOS, payload: sorted_todos });
    try {
      const todos_response = await update_todos(todos);
      const todos_data = todos_response.data;
      const sorted_todos_data = todos_data.sort((a, b) => a.order - b.order);

      if (!isEqual(sorted_todos_data, sorted_todos)) {
        dispatch({ type: SET_TODOS, payload: sorted_todos_data });
      }
    } catch (error) {
      console.error(error);

      // If there is an error, revert the state to the previous state
      dispatch({ type: SET_TODOS, payload: prev_todos });
    }
  };

  return (
    <TodosContext.Provider
      value={{
        todos: state.todos,
        setTodos,
        addTodo,
        addTodos,
        deleteTodo,
        updateTodo,
        updateTodos,
        deleteTodos,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export { TodosProvider, TodosContext };
