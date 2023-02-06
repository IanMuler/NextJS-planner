import { SET_TEMPLATES, ADD_TEMPLATE, DELETE_TEMPLATE } from "../types";
import { ITemplatesState, Template } from "./state";

export interface ITemplatesAction {
  type: string;
  payload: Template | Template[] | Template["_id"];
}

export default function reducer(
  state: ITemplatesState,
  action: ITemplatesAction
) {
  const { payload, type } = action;

  switch (type) {
    case SET_TEMPLATES:
      const templates = payload as Template[];
      return {
        ...state,
        templates,
      };

    case ADD_TEMPLATE:
      const template_add = payload as Template;

      return {
        ...state,
        templates: [template_add, ...state.templates],
      };

    case DELETE_TEMPLATE:
      const id = payload as Template["_id"];
      const new_templates = state.templates.filter(
        (template) => template._id !== id
      );

      return {
        ...state,
        templates: new_templates,
      };

    default:
      return state;
  }
}
