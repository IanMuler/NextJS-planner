import { Todo } from "context/todos/state";
import { Schema, model, models, Model, HydratedDocument } from "mongoose";

export interface ITodo extends Todo, Document {}

export interface ITodoModel extends Model<ITodo, {}, {}> {
  findAllTodos: (user: ITodo["user"]) => HydratedDocument<ITodo>[];
}

const TodoSchema: Schema<ITodo> = new Schema<ITodo, ITodoModel>(
  {
    text: {
      type: String,
      required: [true, "The todo text is required "],
      unique: false,
      trim: true,
      maxlength: [40, "title cannot be grater than 40 characters"],
    },
    duration: {
      type: String,
      required: [true, "The todo duration is required "],
      trim: true,
      maxlength: [7, "duration cannot be grater than 7 characters"],
    },
    notes: {
      type: String,
      required: false,
    },
    draggableId: {
      type: String,
      required: [true, "The todo draggableId is required "],
      unique: true,
      trim: true,
      maxlength: [40, "draggableId cannot be grater than 40 characters"],
    },
    category: {
      type: String,
      required: [true, "The todo category is required "],
      trim: true,
      maxlength: [40, "category cannot be grater than 40 characters"],
    },
    order: {
      type: Number,
      required: [true, "The todo order is required "],
      default: 0,
    },
    start: {
      type: String,
      required: false,
      trim: true,
      maxlength: [7, "start cannot be grater than 7 characters"],
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
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

TodoSchema.statics.findAllTodos = async function (user: ITodo["user"]) {
  return await this.find({ user });
};

export default (models.Todo as ITodoModel) ||
  model<ITodo, ITodoModel>("Todo", TodoSchema);
