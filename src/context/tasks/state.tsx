import React, { createContext, useReducer } from "react";
import {
  SET_TASKS,
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  UPDATE_TASKS,
} from "../types";
import { v4 } from "uuid";
import reducer, { ITasksAction } from "./reducer";
import { ITaskForm } from "components/tasks/form";
import { add_task, delete_task, update_task, update_tasks } from "api/tasks";
import { ObjectId } from "mongoose";
import isEqual from "lodash.isequal";
import { toTasksObject } from "utils/toTasksObject";

export interface Task {
  _id?: ObjectId;
  text: string;
  duration: string;
  draggableId: string;
  assigned: boolean;
  category: "daily" | "weekly" | "other";
  order: number;
}

export interface ITasksState {
  tasks: {
    daily: Task[];
    weekly: Task[];
    other: Task[];
  };
}

export interface ITasksContext extends ITasksState {
  setTasks: (tasks: Task[]) => void;
  addTask: (task_form: ITaskForm, category: Task["category"]) => void;
  deleteTask: (id: Task["_id"]) => void;
  updateTask: (id: Task["_id"], changes: Partial<Task>) => void;
  updateTasks: (tasks: Task[]) => void;
}

const initialState: ITasksState = {
  tasks: {
    daily: [],
    weekly: [],
    other: [],
  },
};

const TasksContext = createContext<ITasksContext>(
  initialState as ITasksContext
);

const TasksProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer<
    React.Reducer<ITasksState, ITasksAction>
  >(reducer, initialState);

  const setTasks: ITasksContext["setTasks"] = (tasks) => {
    // setTasks receives tasks in the form of an array of tasks, but we need to
    // convert it to an object with keys of daily, weekly, and other
    //
    // Each task has an order property, which is the index of the task in the
    // array. We need to sort the tasks by order before we convert them to an object
    const sortedTasks = tasks.sort((a, b) => a.order - b.order);
    const tasksObj = sortedTasks.reduce((acc, task) => {
      const { category } = task;
      if (acc[category]) {
        acc[category].push(task);
      } else {
        acc[category] = [task];
      }
      return acc;
    }, {} as ITasksState["tasks"]);

    dispatch({ type: SET_TASKS, payload: tasksObj });
  };

  const addTask: ITasksContext["addTask"] = async (task_form, category) => {
    const id: Task["draggableId"] = v4();
    const task: Task = {
      ...task_form,
      draggableId: id,
      assigned: false,
      category,
      order: state.tasks[category].length,
    };

    try {
      const task_response = await add_task(task);
      const task_data = task_response.data;
      dispatch({ type: ADD_TASK, payload: task_data });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask: ITasksContext["deleteTask"] = async (id) => {
    try {
      const task_response = await delete_task(id);
      const task_data = task_response.data;
      dispatch({ type: DELETE_TASK, payload: task_data._id });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask: ITasksContext["updateTask"] = async (id, changes) => {
    try {
      const task_response = await update_task(id, changes);
      const task_data = task_response.data;
      dispatch({ type: UPDATE_TASK, payload: { _id: task_data._id, changes } });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTasks: ITasksContext["updateTasks"] = async (tasks) => {
    const prev_tasks = { ...state.tasks };

    const prev_tasks_arr = Object.values(prev_tasks).flat();
    const tasks_upd_arr = prev_tasks_arr.map((task) => {
      const task_upd = tasks.find((t) => t._id === task._id);
      return task_upd ? task_upd : task;
    });

    const tasks_upd_obj: ITasksState["tasks"] = toTasksObject(
      tasks_upd_arr
    ) as ITasksState["tasks"];

    dispatch({ type: UPDATE_TASKS, payload: tasks_upd_obj });

    try {
      const tasks_response = await update_tasks(tasks);
      const tasks_data: Task[] = tasks_response.data; //all tasks from the database after the update
      const tasks_data_obj: ITasksState["tasks"] = toTasksObject(
        tasks_data
      ) as ITasksState["tasks"];

      //make sure the tasks in the database are the same as the tasks in the state
      //if they are not, set the tasks from the database to the state
      if (!isEqual(tasks_data_obj, tasks_upd_obj)) {
        dispatch({ type: UPDATE_TASKS, payload: tasks_data_obj });
      }
    } catch (err) {
      console.error(err);

      //if there is an error, set the tasks back to the previous state
      dispatch({ type: UPDATE_TASKS, payload: prev_tasks });
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks: state.tasks,
        setTasks,
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
