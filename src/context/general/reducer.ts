import { IGeneralState } from "./state";
import {
  GET_START,
  UPDATE_START,
  UPDATE_VISIBLE,
  UPDATE_DRAGGING_TODO,
  UPDATE_DRAGGING_TASK,
  UPDATE_LOADING,
} from "../types";

export interface IGeneralAction {
  type: string;
  payload: string | boolean;
}

export default function reducer(
  state: IGeneralState,
  action: IGeneralAction
): IGeneralState {
  const { payload, type } = action;

  switch (type) {
    case GET_START:
      const start_get = payload as string;
      return {
        ...state,
        wake_up_time: start_get,
      };

    case UPDATE_START:
      const start_upd = payload as string;
      return {
        ...state,
        wake_up_time: start_upd,
      };

    case UPDATE_VISIBLE:
      const tasksVisible = payload as boolean;

      return {
        ...state,
        tasksVisible,
      };

    case UPDATE_DRAGGING_TODO:
      const isDraggingTodo = payload as boolean;
      return {
        ...state,
        isDraggingTodo,
      };

    case UPDATE_DRAGGING_TASK:
      const isDraggingTask = payload as boolean;
      return {
        ...state,
        isDraggingTask,
      };
    case UPDATE_LOADING:
      const loading = payload as boolean;
      return {
        ...state,
        loading,
      };

    default:
      return state;
  }
}
