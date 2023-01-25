import React, { createContext, useReducer } from "react";
import { GET_TASKS, ADD_TASK, DELETE_TASK, UPDATE_TASK } from "../types";
import { v4 } from "uuid";
import reducer, { ITasksAction } from "./reducer";
import { ITaskForm } from "components/tasks/form";

export interface Task {
  text: string;
  duration: string;
  id: string;
  draggableId: string;
  assigned: boolean;
  category: "general" | "daily" | "once";
}

export interface ITasksState {
  tasks: {
    general: Task[];
    daily: Task[];
    once: Task[];
  };
}

export interface ITasksContext extends ITasksState {
  getTasks: () => void;
  addTask: (task_form: ITaskForm, category: Task["category"]) => void;
  deleteTask: (id: Task["id"]) => void;
  updateTask: (id: Task["id"], changes: Partial<Task>) => void;
  updateTasks: (tasks: ITasksState["tasks"]) => void;
}

const initialState: ITasksState = {
  tasks: {
    general: [],
    daily: [],
    once: [],
  },
};

const TasksContext = createContext<ITasksContext>(
  initialState as ITasksContext
);

const TasksProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer<
    React.Reducer<ITasksState, ITasksAction>
  >(reducer, initialState);

  const getTasks: ITasksContext["getTasks"] = () => {
    const tasks =
      JSON.parse(localStorage.getItem("tasks")) || initialState.tasks;
    dispatch({ type: GET_TASKS, payload: tasks });
  };

  const addTask: ITasksContext["addTask"] = (task_form, category) => {
    const id: Task["id"] = v4();
    const task: Task = {
      ...task_form,
      id,
      draggableId: `_${id}`,
      assigned: false,
      category,
    };

    dispatch({
      type: ADD_TASK,
      payload: task,
    });
  };

  const deleteTask: ITasksContext["deleteTask"] = (id) => {
    dispatch({ type: DELETE_TASK, payload: id });
  };

  const updateTask: ITasksContext["updateTask"] = (id, changes) => {
    dispatch({ type: UPDATE_TASK, payload: { id, changes } });
  };

  const updateTasks: ITasksContext["updateTasks"] = (tasks) => {
    dispatch({ type: GET_TASKS, payload: tasks });
  };

  return (
    <TasksContext.Provider
      value={{
        tasks: state.tasks,
        getTasks,
        addTask,
        deleteTask,
        updateTask,
        updateTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export { TasksProvider, TasksContext };
