import { ITasksState, Task } from "./state";
import {
  SET_TASKS,
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
    | Partial<ITasksState["tasks"]>
    | Task["_id"]
    | { _id: Task["_id"]; changes: Partial<Task> };
}

export default function reducer(
  state: ITasksState,
  action: ITasksAction
): ITasksState {
  const { type, payload } = action;

  switch (type) {
    case SET_TASKS:
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
      const id = payload as Task["_id"];
      const task_del = Object.keys(state.tasks).reduce((acc, category) => {
        const task: Task = state.tasks[category].find((t) => {
          return t._id === id;
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
            (t) => t._id !== task_del._id
          ),
        },
      };

    case UPDATE_TASK:
      const upd_data = payload as { _id: Task["_id"]; changes: Partial<Task> };
      const task_upd = Object.keys(state.tasks).reduce((acc, category) => {
        const task = state.tasks[category]?.find((t) => t._id === upd_data._id);
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
            task._id === task_upd._id ? task_upd : task
          ),
        },
      };

    case UPDATE_TASKS:
      const tasks_upd = payload as Partial<ITasksState["tasks"]>;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          ...tasks_upd,
        },
      };

    default:
      return state;
  }
}
