import { refreshToDo } from "./todo";
import type { ITasksContext, Task } from "context/tasks/state";
import { IContexts } from "pages";
import { DropResult } from "react-beautiful-dnd";
import { ITodosContext, Todo } from "context/todos/state";

export const handleDragEnd = async (
  result: DropResult,
  contexts: IContexts
) => {
  const { destination, source } = result;
  if (!destination) return;

  const { tasks_context, todos_context } = contexts;

  // if the item is dropped in the same place, no action is required
  if (isDroppedAtSamePlace(destination, source)) return;

  // todo task to delete icon
  if (isTodoTaskToDelete(source, destination)) {
    return refreshToDo(todos_context.todos[source.index], contexts);
  }

  // Reorder in the same list
  if (isReorderInSameList(destination, source)) {
    handleReorder(destination, source, tasks_context, todos_context);
  }

  // tasks lists to todo list
  if (isTaskListToTodoList(source, destination)) {
    await handleTaskToTodoList(
      destination,
      source,
      todos_context,
      tasks_context
    );
  }

  // todo list to tasks list
  if (isTodoListToTaskList(source, destination, tasks_context)) {
    const todo = todos_context.todos[source.index];
    refreshToDo(todo, contexts);
  }
};

const isDroppedAtSamePlace = (
  destination: DropResult["destination"],
  source: DropResult["source"]
) => {
  return (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  );
};

const isTodoTaskToDelete = (
  source: DropResult["source"],
  destination: DropResult["destination"]
) => {
  return source.droppableId === "todo" && destination.droppableId === "delete";
};

const isReorderInSameList = (
  destination: DropResult["destination"],
  source: DropResult["source"]
) => {
  return (
    destination.droppableId === source.droppableId &&
    destination.index !== source.index
  );
};

const isTaskListToTodoList = (
  source: DropResult["source"],
  destination: DropResult["destination"]
) => {
  return source.droppableId !== "todo" && destination.droppableId === "todo";
};

const isTodoListToTaskList = (
  source: DropResult["source"],
  destination: DropResult["destination"],
  tasks_context: ITasksContext
) => {
  const categories = Object.keys(tasks_context.tasks);
  return (
    source.droppableId === "todo" &&
    categories.includes(destination.droppableId)
  );
};

const handleReorder = (
  destination: DropResult["destination"],
  source: DropResult["source"],
  tasks_context: ITasksContext,
  todos_context: ITodosContext
) => {
  const isMovingUp = destination.index < source.index;
  let i = isMovingUp ? destination.index : source.index;
  const sourceId = source.droppableId;

  if (sourceId === "todo") {
    handleTodoReorder(source, destination, isMovingUp, i, todos_context);
  } else {
    handleTaskReorder(source, destination, isMovingUp, i, tasks_context);
  }
};

const handleTodoReorder = (
  source: DropResult["source"],
  destination: DropResult["destination"],
  isMovingUp: boolean,
  i: number,
  todos_context: ITodosContext
) => {
  const todo_tasks: Todo[] = [...todos_context.todos];

  //every task list is ordered by order property
  for (i; isMovingUp ? i < source.index : i <= destination.index; i++) {
    todo_tasks[i].order = isMovingUp ? i + 1 : i - 1;
  }

  todo_tasks[source.index].order = destination.index;

  todos_context.updateTodos(todo_tasks);
};

const handleTaskReorder = (
  source: DropResult["source"],
  destination: DropResult["destination"],
  isMovingUp: boolean,
  i: number,
  tasks_context: ITasksContext
) => {
  const category_tasks: Task[] = [...tasks_context.tasks[source.droppableId]];

  //reassign order property to every task depending on the destination of the drag
  for (i; isMovingUp ? i < source.index : i <= destination.index; i++) {
    category_tasks[i].order = isMovingUp ? i + 1 : i - 1;
  }

  //reassign order property to the dragged task
  category_tasks[source.index].order = destination.index;
  const sorted_category_tasks = category_tasks.sort(
    (a, b) => a.order - b.order
  );

  tasks_context.updateTasks(sorted_category_tasks);
};

const handleTaskToTodoList = async (
  destination: DropResult["destination"],
  source: DropResult["source"],
  todos_context: ITodosContext,
  tasks_context: ITasksContext
) => {
  const task: Task = tasks_context.tasks[source.droppableId][source.index];
  await todos_context.addTodo(task, destination.index);
  tasks_context.updateTask(task._id, { assigned: true });
};
