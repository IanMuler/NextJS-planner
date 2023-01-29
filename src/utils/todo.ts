import { IGeneralState } from "context/general/state";
import { ITasksContext } from "context/tasks/state";
import { ITodosContext, Todo } from "context/todos/state";
import { IContexts } from "pages";
import { addTime } from "./addTime";

type RefreshToDoList = (
  tasks: ITasksContext["tasks"],
  todos: ITodosContext["todos"],
  updateTask: ITasksContext["updateTask"],
  deleteTodo: ITodosContext["deleteTodo"]
) => void;

export const refreshToDoList: RefreshToDoList = (
  tasks,
  todos,
  updateTask,
  deleteTodo
) => {
  if (todos.length > 0) {
    if (window.confirm("Are you sure you want to refresh the ToDo list?")) {
      // unassign all tasks
      Object.values(tasks).forEach((task_list) => {
        task_list?.forEach((task) => {
          if (task.assigned) {
            updateTask(task.id, { assigned: false });
          }
        });
      });
      // delete all todos
      todos.forEach((todo) => {
        deleteTodo(todo.id);
      });
    }
  }
};

type RefreshToDo = (todo: Todo, contexts: IContexts) => void;

export const refreshToDo: RefreshToDo = (todo, contexts) => {
  const { updateTask } = contexts.tasks_context;
  const { todos, deleteTodo } = contexts.todos_context;
  const { updateDraggingTodo } = contexts.general_context;
  if (window.confirm("Are you sure you want to remove this task?")) {
    deleteTodo(todo.id);
    const onlyExistOne = todos.filter((t) => t.id === todo.id).length === 1;
    if (onlyExistOne) updateTask(todo.from_id, { assigned: false });
    updateDraggingTodo(false);
  }
};

type AddWakeUpTime = (
  todos: ITodosContext["todos"],
  updateTodo: ITodosContext["updateTodo"],
  wakeUpTime: IGeneralState["wakeUpTime"]
) => void;

export const addWakeUpTime: AddWakeUpTime = (todos, updateTodo, wakeUpTime) => {
  const todos_list = todos;
  if (
    // false if every task has start time and there is wake up time
    // true if wake up time and first task start time are the same
    (!todos_list.every((todo) => todo.start) && wakeUpTime) ||
    wakeUpTime !== todos_list[0].start
  ) {
    todos_list.map((todo, index) => {
      const start = todos_list
        .slice(0, index)
        .reduce(
          (acumulator, todo) => addTime(acumulator, todo.duration),
          wakeUpTime
        );
      updateTodo(todo.id, { start });
    });
  }
};
