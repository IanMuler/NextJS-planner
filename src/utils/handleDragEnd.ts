import { refreshToDo } from "./todo";
import type { Task } from "context/tasks/state";
import { IContexts } from "pages";

interface IResult {
  destination: {
    droppableId: string;
    index: number;
  };
  source: {
    droppableId: string;
    index: number;
  };
}

export const handleDragEnd = (result: IResult, contexts: IContexts) => {
  const { destination, source } = result;
  const { tasks, updateTask, updateTasks } = contexts.tasks_context;
  const { todos, addTodo, updateTodos, deleteTodo } = contexts.todos_context;
  const { updateDraggingTodo } = contexts.general_context;

  if (!destination) {
    return;
  }

  // same place
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  if (
    // todo task to delete icon
    source.droppableId === "todo" &&
    destination.droppableId === "delete"
  ) {
    return refreshToDo(todos[source.index], contexts);
  }

  // same list, different order
  if (
    destination.droppableId === source.droppableId &&
    destination.index !== source.index
  ) {
    if (source.droppableId === "todo") {
      const new_todos = [...todos];
      const [removed] = new_todos.splice(source.index, 1);
      new_todos.splice(destination.index, 0, removed);

      //start must be null to refresh the start generator function
      updateTodos(new_todos.map((todo) => ({ ...todo, start: null })));
    }

    if (source.droppableId !== "todo") {
      const category_tasks = [...tasks[source.droppableId]];
      const [removed] = category_tasks.splice(source.index, 1);
      category_tasks.splice(destination.index, 0, removed);

      updateTasks({
        ...tasks,
        [source.droppableId]: category_tasks,
      });
    }
  }

  if (
    // tasks lists to todo list
    source.droppableId !== "todo" &&
    destination.droppableId === "todo"
  ) {
    const task: Task = tasks[source.droppableId][source.index];
    updateTask(task.id, { assigned: true });
    addTodo(task, destination.index);
  }

  if (
    // todo list to tasks list
    source.droppableId === "todo" &&
    destination.droppableId !== "todo"
  ) {
    const todo = todos[source.index];
    const categories = Object.keys(tasks);

    if (categories.includes(destination.droppableId)) {
      const onlyExistOne =
        todos.filter((t) => t.text === todo.text).length === 1;
      if (onlyExistOne) updateTask(todo.from_id, { assigned: false });
      deleteTodo(todo.id);
      // force isDraggingTodo to false, react-beautiful-dnd for some reason doesnt update isDragging
      updateDraggingTodo(false);
    }
  }
};
