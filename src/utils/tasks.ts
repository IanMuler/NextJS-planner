import { ITasksContext, Task } from "context/tasks/state";

export const disassignTasks = (tasks: ITasksContext["tasks"]) => {
  const list = Object.values(tasks).reduce((acumulator, category) => {
    const tasks_assigned = category.filter((task) => task.assigned);
    const tasks_disassigned = tasks_assigned.map((task) => ({
      ...task,
      assigned: false,
    }));
    return [...acumulator, ...tasks_disassigned];
  }, [] as Task[]);

  return list;
};
