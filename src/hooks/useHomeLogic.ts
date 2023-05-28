// hooks/useHomeLogic.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { IContexts } from "pages";
import { handleDragEnd } from "utils/handleDragEnd";
import { get_tasks } from "api/tasks";
import { get_todos } from "api/todos";
import { get_templates } from "api/templates";
import { Session } from "next-auth";

export const useHomeLogic = (session: Session, contexts: IContexts) => {
  const todoRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const { general_context, tasks_context, todos_context, templates_context } =
    contexts;
  const { wakeUpTime, isDraggingTodo, tasksVisible, isDraggingTask } =
    general_context;
  const { setTasks } = tasks_context;
  const { todos, setTodos } = todos_context;
  const { setTemplates } = templates_context;

  const fetchData = useCallback(async () => {
    if (!session || !session.user) {
      setIsLoading(false);
      return;
    }

    const user_email = session.user.email;

    const tasks_response = await get_tasks(user_email);
    const todos_response = await get_todos(user_email);
    const templates_response = await get_templates(user_email);

    setTasks(tasks_response.data);
    setTodos(todos_response.data);
    setTemplates(templates_response.data);
    setIsLoading(false);
  }, [session, setTasks, setTodos, setTemplates]);

  const handleDesktop = useCallback(() => {
    if (window.innerWidth > 1200) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
  }, []);

  const handleWakeUpTime = (e) => {
    general_context.updateStart(e.target.value);
  };

  const handleDragEndCallback = (result) => {
    handleDragEnd(result, contexts);
  };

  useEffect(() => {
    if (todos.length === 0 && todos.length === 0 && session?.user) {
      fetchData();
    }
  }, [session?.user]);

  useEffect(() => {
    localStorage.setItem("wakeUpTime", wakeUpTime);
  }, [wakeUpTime]);

  useEffect(() => {
    general_context.getStart();
    handleDesktop();
    fetchData();
  }, []);

  return {
    todoRef,
    isLoading,
    isDesktop,
    isDraggingTodo,
    isDraggingTask,
    tasksVisible,
    wakeUpTime,
    handleWakeUpTime,
    handleDragEnd: handleDragEndCallback,
  };
};
