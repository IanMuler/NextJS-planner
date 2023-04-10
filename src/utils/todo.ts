import { IGeneralState } from "context/general/state";
import { ITasksContext, Task } from "context/tasks/state";
import { ITodosContext, Todo } from "context/todos/state";
import { IContexts } from "pages";
import { addTime } from "./addTime";
import { disassignTasks } from "./tasks";

type RefreshToDoList = (
  tasks: ITasksContext["tasks"],
  todos: ITodosContext["todos"],
  updateTask: ITasksContext["updateTasks"],
  deleteTodos: ITodosContext["deleteTodos"]
) => void;

export const refreshToDoList: RefreshToDoList = (
  tasks,
  todos,
  updateTasks,
  deleteTodos
) => {
  if (todos.length > 0) {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      const tasks_disassigned = disassignTasks(tasks);
      updateTasks(tasks_disassigned);

      deleteTodos(todos.map((todo) => todo._id));
    }
  }
};

type RefreshToDo = (todo: Todo, contexts: IContexts) => void;

export const refreshToDo: RefreshToDo = (todo, contexts) => {
  const { updateTask } = contexts.tasks_context;
  const { todos, deleteTodo } = contexts.todos_context;
  const { updateDraggingTodo } = contexts.general_context;

  deleteTodo(todo._id);
  const onlyExistOne = todos.filter((t) => t.task === todo.task).length === 1;
  if (onlyExistOne) updateTask(todo.task, { assigned: false });
  updateDraggingTodo(false);
};

type AddWakeUpTime = (
  todos: ITodosContext["todos"],
  updateTodos: ITodosContext["updateTodos"],
  wakeUpTime: IGeneralState["wakeUpTime"]
) => void;

export const addWakeUpTime: AddWakeUpTime = (
  todos,
  updateTodos,
  wakeUpTime
) => {
  const todos_list = [...todos];
  todos_list.forEach((todo, index) => {
    const start = todos_list
      .slice(0, index)
      .reduce(
        (acumulator, todo) => addTime(acumulator, todo.duration),
        wakeUpTime
      );

    todo.start = start;
  });

  updateTodos(todos_list);
};

export const isTodoStartsUpdated = (todos: Todo[]) => {
  let isUpdated = true;

  for (let index = 0; index < todos.length - 1; index++) {
    const nextStartIsUpdate =
      addTime(todos[index].start, todos[index].duration) ===
      todos[index + 1]?.start;

    if (!todos[index].start || !nextStartIsUpdate) isUpdated = false;
  }

  return isUpdated;
};
