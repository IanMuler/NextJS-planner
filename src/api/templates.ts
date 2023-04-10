import { Template } from "context/templates/state";
import client from "./client";

interface ITemplatesResponse {
  data: {
    data: Template[];
    success: boolean;
  };
}

interface ITemplateResponse {
  data: {
    data: Template;
    success: boolean;
  };
}

export const get_templates = async (
  user: Template["user"]
): Promise<ITemplatesResponse["data"]> => {
  const response: ITemplatesResponse = await client.get("/api/templates", {
    params: { user },
  });
  return response.data;
};

export const add_template = async (
  template: Template
): Promise<ITemplateResponse["data"]> => {
  const response: ITemplateResponse = await client.post(
    "/api/templates",
    template
  );
  return response.data;
};

export const delete_template = async (
  id: Template["_id"]
): Promise<ITemplateResponse["data"]> => {
  const response: ITemplateResponse = await client.delete(
    `/api/templates/${id}`
  );
  return response.data;
};
