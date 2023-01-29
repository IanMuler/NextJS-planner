import React, { createContext, useReducer } from "react";
import { GET_TEMPLATES, ADD_TEMPLATE, DELETE_TEMPLATE } from "../types";
import reducer, { ITemplatesAction } from "./reducer";
import { Todo } from "../todos/state";
import { v4 } from "uuid";

export interface Template {
  id: string;
  name: string;
  todos: Todo[];
}

export interface ITemplatesState {
  templates: Template[];
}

export interface ITemplatesContext extends ITemplatesState {
  getTemplates: () => void;
  addTemplate: (name: Template["name"], todos: Template["todos"]) => void;
  deleteTemplate: (id: Template["id"]) => void;
}

const initialState: ITemplatesState = {
  templates: [],
};

const TemplatesContext = createContext<ITemplatesContext>(
  initialState as ITemplatesContext
);

const TemplatesProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer<
    React.Reducer<ITemplatesState, ITemplatesAction>
  >(reducer, initialState);

  const getTemplates: ITemplatesContext["getTemplates"] = () => {
    const templates: Template[] =
      JSON.parse(localStorage.getItem("templates")) || initialState.templates;
    dispatch({ type: GET_TEMPLATES, payload: templates });
  };

  const addTemplate: ITemplatesContext["addTemplate"] = (name, todos) => {
    const id = v4();
    const template: Template = {
      id,
      name,
      todos,
    };

    dispatch({ type: ADD_TEMPLATE, payload: template });
  };

  const deleteTemplate: ITemplatesContext["deleteTemplate"] = (id) =>
    dispatch({ type: DELETE_TEMPLATE, payload: id });

  return (
    <TemplatesContext.Provider
      value={{
        templates: state.templates,
        getTemplates,
        addTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};

export { TemplatesContext, TemplatesProvider };
