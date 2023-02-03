import { refreshToDo } from "./todo";
import type { Task } from "context/tasks/state";
import { IContexts } from "pages";
import { DropResult } from "react-beautiful-dnd";
import { Todo } from "context/todos/state";

export const handleDragEnd = (result: DropResult, contexts: IContexts) => {
  const { destination, source } = result;
  const { tasks, updateTask, updateTasks } = contexts.tasks_context;
  const { todos, addTodo, updateTodos, deleteTodo } = contexts.todos_context;

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
    const isMovingUp = destination.index < source.index;
    let i = isMovingUp ? destination.index : source.index;

    if (source.droppableId === "todo") {
      const todo_tasks: Todo[] = [...todos];
      //every task list is ordered by order property
      for (i; isMovingUp ? i < source.index : i <= destination.index; i++) {
        todo_tasks[i].order = isMovingUp ? i + 1 : i - 1;
      }

      todo_tasks[source.index].order = destination.index;

      updateTodos(todo_tasks.map((todo) => ({ ...todo, start: null })));
    } else {
      const category_tasks: Task[] = [...tasks[source.droppableId]];
      //reasign order property to every task depending on the destination of the drag
      for (i; isMovingUp ? i < source.index : i <= destination.index; i++) {
        category_tasks[i].order = isMovingUp ? i + 1 : i - 1;
      }
      //reasign order property to the dragged task
      category_tasks[source.index].order = destination.index;
      const sorted_category_tasks = category_tasks.sort(
        (a, b) => a.order - b.order
      );
      updateTasks(sorted_category_tasks);
    }
  }

  if (
    // tasks lists to todo list
    source.droppableId !== "todo" &&
    destination.droppableId === "todo"
  ) {
    const task: Task = tasks[source.droppableId][source.index];
    updateTask(task._id, { assigned: true });
    //reasign order property to every task depending on the destination of the drag
    const todo_reordered: Todo[] = [...todos].map((todo, index) => {
      if (index >= destination.index) {
        todo.order = index + 1;
      }
      return todo;
    });
    //update order of todos before adding the new one
    if (todo_reordered.length > 0) updateTodos(todo_reordered);
    addTodo(task, destination.index);
  }

  if (
    // todo list to tasks list
    source.droppableId === "todo" &&
    destination.droppableId !== "todo"
  ) {
    const todo = todos[source.index];
    const categories = Object.keys(tasks);
    if (categories.includes(destination.droppableId))
      refreshToDo(todo, contexts);
  }
};
