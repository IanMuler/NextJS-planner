import { ITasksState, Task } from "./state";
import {
  GET_TASKS,
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  UPDATE_TASKS,
} from "../types";

export interface ITasksAction {
  type: string;
  payload:
    | Task
    | ITasksState["tasks"]
    | Task["id"]
    | { id: Task["id"]; changes: Partial<Task> };
}

export default function reducer(
  state: ITasksState,
  action: ITasksAction
): ITasksState {
  const { type, payload } = action;

  switch (type) {
    case GET_TASKS:
      const tasks = payload as ITasksState["tasks"];
      return {
        ...state,
        tasks,
      };

    case ADD_TASK:
      const task_add = payload as Task;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task_add.category]: [...state.tasks[task_add.category], task_add],
        },
      };

    case DELETE_TASK:
      const id = payload as Task["id"];
      const task_del = Object.keys(state.tasks).reduce((acc, category) => {
        const task = state.tasks[category].find((t) => {
          return t.id === id;
        });
        if (task) {
          acc = task;
        }
        return acc;
      }, {} as Task);

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task_del.category]: state.tasks[task_del.category].filter(
            (t) => t.id !== task_del.id
          ),
        },
      };

    case UPDATE_TASK:
      const upd_data = payload as { id: Task["id"]; changes: Partial<Task> };
      const task_upd = Object.keys(state.tasks).reduce((acc, category) => {
        const task = state.tasks[category]?.find((t) => t.id === upd_data.id);
        if (task) {
          acc = { ...task, ...upd_data.changes };
        }
        return acc;
      }, {} as Task);

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task_upd.category]: state.tasks[task_upd.category]?.map((task) =>
            task.id === task_upd.id ? task_upd : task
          ),
        },
      };

    case UPDATE_TASKS:
      const tasks_upd = payload as ITasksState["tasks"];
      return {
        ...state,
        tasks: tasks_upd,
      };

    default:
      return state;
  }
}
