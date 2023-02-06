import { Template } from "context/templates/state";
import { Schema, model, models, Model, HydratedDocument } from "mongoose";
import Todo from "./Todo";

export interface ITemplate extends Template, Document {}

export interface ITemplateModel extends Model<ITemplate, {}, {}> {
  findAllTemplates: () => HydratedDocument<ITemplate>[];
}

const TemplateSchema: Schema<ITemplate> = new Schema<ITemplate, ITemplateModel>(
  {
    name: {
      type: String,
      required: [true, "The template name is required "],
      unique: true,
      trim: true,
      maxlength: [40, "title cannot be grater than 40 characters"],
    },
    //relate "todos:" with "todos" collection
    todos: {
      type: [Todo.schema],
      required: [true, "The template todos is required "],
    },
  },
  {
    versionKey: false,
  }
);

TemplateSchema.statics.findAllTemplates = async function () {
  return await this.find({});
};

export default (models.Template as ITemplateModel) ||
  model<ITemplate, ITemplateModel>("Template", TemplateSchema);
