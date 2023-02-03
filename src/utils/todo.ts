import { IGeneralState } from "context/general/state";
import { ITasksContext, Task } from "context/tasks/state";
import { ITodosContext, Todo } from "context/todos/state";
import { IContexts } from "pages";
import { addTime } from "./addTime";

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
      // An array of tasks that are assigned and then disassigned
      const tasks_list = Object.values(tasks).reduce((acumulator, category) => {
        const tasks_assigned = category.filter((task) => task.assigned);
        const tasks_disassigned = tasks_assigned.map((task) => ({
          ...task,
          assigned: false,
        }));
        return [...acumulator, ...tasks_disassigned];
      }, [] as Task[]);

      updateTasks(tasks_list);

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
  const onlyExistOne =
    todos.filter((t) => t.from_id === todo.from_id).length === 1;
  if (onlyExistOne) updateTask(todo.from_id, { assigned: false });
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
  if (
    // false if every task has start time and there is wake up time
    // true if wake up time and first task start time are the same
    (!todos_list.every((todo) => todo.start) && wakeUpTime) ||
    wakeUpTime !== todos_list[0].start
  ) {
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
  }
};
