import React, { createContext, useReducer } from "react";
import {
  UPDATE_START,
  UPDATE_VISIBLE,
  UPDATE_DRAGGING_TODO,
  UPDATE_DRAGGING_TASK,
  UPDATE_LOADING,
} from "../types";
import reducer, { IGeneralAction } from "./reducer";

export interface IGeneralState {
  wakeUpTime: string;
  tasksVisible: boolean;
  isDraggingTodo: boolean;
  isDraggingTask: boolean;
  loading: boolean;
}

export interface IGeneralContext extends IGeneralState {
  getStart: () => void;
  updateStart: (time: string) => void;
  updateVisible: (value: boolean) => void;
  updateDraggingTodo: (value: boolean) => void;
  updateDraggingTask: (value: boolean) => void;
  updateLoading: (value: boolean) => void;
}

const initialState: IGeneralState = {
  wakeUpTime: "08:00",
  tasksVisible: false,
  isDraggingTodo: false,
  isDraggingTask: false,
  loading: false,
};

const GeneralContext = createContext<IGeneralContext>(
  initialState as IGeneralContext
);

const GeneralProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer<
    React.Reducer<IGeneralState, IGeneralAction>
  >(reducer, initialState);

  const getStart: IGeneralContext["getStart"] = () => {
    const wakeUpTime = localStorage.getItem("wakeUpTime");
    if (wakeUpTime) dispatch({ type: UPDATE_START, payload: wakeUpTime });
  };
  const updateStart: IGeneralContext["updateStart"] = (time) =>
    dispatch({ type: UPDATE_START, payload: time });
  const updateVisible: IGeneralContext["updateVisible"] = (value) =>
    dispatch({ type: UPDATE_VISIBLE, payload: value });
  const updateDraggingTodo: IGeneralContext["updateDraggingTodo"] = (value) =>
    dispatch({ type: UPDATE_DRAGGING_TODO, payload: value });
  const updateDraggingTask: IGeneralContext["updateDraggingTask"] = (value) =>
    dispatch({ type: UPDATE_DRAGGING_TASK, payload: value });
  const updateLoading: IGeneralContext["updateLoading"] = (value) =>
    dispatch({ type: UPDATE_LOADING, payload: value });

  return (
    <GeneralContext.Provider
      value={{
        wakeUpTime: state.wakeUpTime,
        tasksVisible: state.tasksVisible,
        isDraggingTodo: state.isDraggingTodo,
        isDraggingTask: state.isDraggingTask,
        loading: state.loading,
        getStart,
        updateStart,
        updateVisible,
        updateDraggingTodo,
        updateDraggingTask,
        updateLoading,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export { GeneralProvider, GeneralContext };
