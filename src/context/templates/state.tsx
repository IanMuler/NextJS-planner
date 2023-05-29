import React, { createContext, useReducer } from "react";
import { SET_TEMPLATES, ADD_TEMPLATE, DELETE_TEMPLATE } from "../types";
import reducer, { ITemplatesAction } from "./reducer";
import { Todo } from "../todos/state";
import { add_template, delete_template } from "api/templates";
import { enqueueSnackbar } from "notistack";

export interface Template {
  _id?: string;
  name: string;
  todos: Todo[];
  user: string;
}

export interface ITemplatesState {
  templates: Template[];
}

export interface ITemplatesContext extends ITemplatesState {
  setTemplates: (templates: Template[]) => void;
  addTemplate: (name: Template["name"], todos: Template["todos"]) => void;
  deleteTemplate: (id: Template["_id"]) => void;
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

  const setTemplates: ITemplatesContext["setTemplates"] = (templates) => {
    dispatch({ type: SET_TEMPLATES, payload: templates });
  };

  const addTemplate: ITemplatesContext["addTemplate"] = async (name, todos) => {
    const template: Template = {
      name,
      todos,
      user: todos[0]?.user,
    };

    if (!template.user) {
      enqueueSnackbar("You have to be logged in to save a template", {
        variant: "error",
      });
      return;
    }

    try {
      const template_response = await add_template(template);
      const template_data = template_response.data;

      dispatch({ type: ADD_TEMPLATE, payload: template_data });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTemplate: ITemplatesContext["deleteTemplate"] = async (id) => {
    try {
      const template_response = await delete_template(id);
      const template_data = template_response.data;
      dispatch({ type: DELETE_TEMPLATE, payload: template_data._id });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TemplatesContext.Provider
      value={{
        templates: state.templates,
        setTemplates,
        addTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};

export { TemplatesContext, TemplatesProvider };
