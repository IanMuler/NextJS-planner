import { Task } from "context/tasks/state";
import { Schema, model, models, Model, HydratedDocument } from "mongoose";

export interface ITask extends Task, Document {}

export interface ITaskModel extends Model<ITask, {}, {}> {
  findAllTasks: (user: ITask["user"]) => HydratedDocument<ITask>[];
}

const TaskSchema: Schema<ITask> = new Schema<ITask, ITaskModel>(
  {
    text: {
      type: String,
      required: [true, "The task text is required "],
      unique: true,
      trim: true,
      maxlength: [40, "title cannot be grater than 40 characters"],
    },
    duration: {
      type: String,
      required: [true, "The task duration is required "],
      trim: true,
      maxlength: [7, "duration cannot be grater than 7 characters"],
    },
    notes: {
      type: String,
      required: false,
    },
    draggableId: {
      type: String,
      required: [true, "The task draggableId is required "],
      unique: true,
      trim: true,
      maxlength: [40, "draggableId cannot be grater than 40 characters"],
    },
    assigned: {
      type: Boolean,
      required: [true, "The task assigned is required "],
      default: false,
    },
    category: {
      type: String,
      required: [true, "The task category is required "],
      trim: true,
      maxlength: [40, "category cannot be grater than 40 characters"],
    },
    order: {
      type: Number,
      required: [true, "The task order is required "],
      default: 0,
    },
    user: {
      type: String,
      required: [true, "The task user is required "],
      trim: true,
      maxlength: [40, "user cannot be grater than 40 characters"],
    },
  },
  {
    versionKey: false,
  }
);

TaskSchema.statics.findAllTasks = async function (user: ITask["user"]) {
  return await this.find({ user });
};

export default (models.Task as ITaskModel) ||
  model<ITask, ITaskModel>("Task", TaskSchema);
