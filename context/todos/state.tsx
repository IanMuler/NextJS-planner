import React, { createContext, useReducer } from "react";
import { GET_TODOS, ADD_TODO, UPDATE_TODO, DELETE_TODO } from "../types";
import reducer, { ITodosAction } from "./reducer";
import { Task } from "../tasks/state";
import { v4 } from "uuid";

//all "Task" properties less "assigned"
export interface Todo extends Omit<Task, "assigned"> {
  start: string; // time when the task must be started
  from_id: string; // id of the task from which this todo was created
}

export interface ITodosState {
  todos: Todo[];
}

export interface ITodosContext extends ITodosState {
  getTodos: () => void;
  addTodo: (task: Task) => void;
  deleteTodo: (id: Todo["id"]) => void;
  updateTodo: (id: Todo["id"], changes: Partial<Todo>) => void;
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

  const getTodos: ITodosContext["getTodos"] = () => {
    const todos =
      JSON.parse(localStorage.getItem("todos")) || initialState.todos;
    dispatch({ type: GET_TODOS, payload: todos });
  };

  const addTodo: ITodosContext["addTodo"] = (task) => {
    const { assigned, ...rest } = task;
    const id = v4();
    const todo: Todo = {
      ...rest,
      start: null,
      id,
      draggableId: `_${id}`,
      from_id: task.id,
    };

    dispatch({ type: ADD_TODO, payload: todo });
  };

  const deleteTodo: ITodosContext["deleteTodo"] = (id) =>
    dispatch({ type: DELETE_TODO, payload: id });

  const updateTodo: ITodosContext["updateTodo"] = (id, changes) =>
    dispatch({ type: UPDATE_TODO, payload: { id, changes } });

  const updateTodos: ITodosContext["updateTodos"] = (todos) =>
    dispatch({ type: GET_TODOS, payload: todos });

  return (
    <TodosContext.Provider
      value={{
        todos: state.todos,
        getTodos,
        addTodo,
        deleteTodo,
        updateTodo,
        updateTodos,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export { TodosProvider, TodosContext };
