import { Task } from "context/tasks/state";

/**
 * @description
 * Takes an array of tasks and returns an object with the category each task belongs to as the key,
 * ordered by the order property of each task
 *
 * @param **tasks**: Task[]
 * @returns *[key: string]: Task[]*
 **/

interface ITasksObject {
  [key: string]: Task[];
}

export const toTasksObject = (tasks: Task[]): ITasksObject => {
  //sort tasks by order
  const sorted_tasks = tasks.sort((a, b) => a.order - b.order);

  //reorganize tasks into an object with the category each task belongs to as the key
  const task_object: ITasksObject = sorted_tasks.reduce((acc, task) => {
    const { category } = task;
    if (acc[category]) {
      acc[category].push(task);
    } else {
      acc[category] = [task];
    }
    return acc;
  }, {});

  return task_object;
};
