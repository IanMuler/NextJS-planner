// Built-in and third-party modules
import React, { useEffect, useState, useContext, useRef } from "react";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { DragDropContext } from "react-beautiful-dnd";
import { GetServerSideProps, NextPage } from "next";

// Components
import TodoList from "components/todos/list";
import TasksContainer from "components/tasks/container";
import Templates from "components/templates";
import DeleteIcon from "components/delete-icon";
import LoadingSpinner from "components/loading-spinner";

// Contexts
import { GeneralContext, type IGeneralContext } from "context/general/state";
import { Task, TasksContext, type ITasksContext } from "context/tasks/state";
import { Todo, TodosContext, type ITodosContext } from "context/todos/state";
import { Template, TemplatesContext } from "context/templates/state";

// Utilities
import { handleDragEnd } from "utils/handleDragEnd";
import { refreshToDoList } from "utils/todo";

// Hooks
import { useSwipe } from "hooks/useSwipe";

// API
import { get_tasks } from "api/tasks";
import { get_todos } from "api/todos";
import { get_templates } from "api/templates";
import { authOptions } from "pages/api/auth/[...nextauth]";

// Styles
import {
  Container,
  Application,
  TimeWakeUp,
  RefreshIcon,
  TodoContainer,
  TodoOptions,
  Options,
  ArrowIcon,
} from "styles/home";

export interface IContexts {
  general_context: IGeneralContext;
  tasks_context: ITasksContext;
  todos_context: ITodosContext;
}

interface IPageProps {
  db_tasks: Task[];
  db_todos: Todo[];
  db_templates: Template[];
}

const Home: NextPage<IPageProps> = ({ db_tasks, db_todos, db_templates }) => {
  const { data: session } = useSession();
  const general_context = useContext(GeneralContext);
  const tasks_context = useContext(TasksContext);
  const todos_context = useContext(TodosContext);
  const templates_context = useContext(TemplatesContext);
  const {
    wakeUpTime,
    tasksVisible,
    isDraggingTodo,
    isDraggingTask,
    loading,
    updateVisible,
    updateStart,
    getStart,
  } = general_context;
  const { tasks, updateTasks, setTasks } = tasks_context;
  const { todos, deleteTodos, setTodos } = todos_context;
  const { setTemplates } = templates_context;

  const [todoTop, setTodoTop] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const isDragging = isDraggingTodo || isDraggingTask;
  const todoRef = useRef<HTMLDivElement>(null); //ref to get todo top position to set tasks container fixed position
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
    updateVisible,
    isDragging
  );
  const contexts: IContexts = {
    general_context,
    tasks_context,
    todos_context,
  };

  const handleDesktop = () => {
    if (window.innerWidth > 768) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
  };

  useEffect(() => {
    getStart();
    handleDesktop();
    setTemplates(db_templates);
    setTasks(db_tasks);
    setTodos(db_todos);
  }, []);

  useEffect(() => {
    if (db_tasks.length === 0 && db_todos.length === 0 && session?.user) {
      const user_email = session.user.email;

      get_tasks(user_email).then((res) => {
        setTasks(res.data);
      });
      get_todos(user_email).then((res) => {
        setTodos(res.data);
      });
      get_templates(user_email).then((res) => {
        setTemplates(res.data);
      });
    }
  }, [session?.user]);

  useEffect(() => {
    localStorage.setItem("wakeUpTime", wakeUpTime);
  }, [wakeUpTime]);

  //get todo top position to set tasks container top position
  useEffect(() => {
    if (todoRef.current) {
      setTodoTop(todoRef.current.getBoundingClientRect().top);
    }
  }, [todoRef]);

  const handleWakeUpTime = (e) => {
    updateStart(e.target.value);
  };

  return (
    <main>
      <DragDropContext
        onDragEnd={(result) => {
          handleDragEnd(result, contexts);
        }}
      >
        <Application
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {loading && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <LoadingSpinner />
            </div>
          )}
          {!loading && (
            <Container>
              <TodoContainer>
                <div ref={todoRef}>
                  <TodoOptions>
                    <TimeWakeUp
                      value={wakeUpTime}
                      type="time"
                      onChange={(e) => {
                        handleWakeUpTime(e);
                      }}
                    />
                    <Options>
                      {!isDesktop && <DeleteIcon isDragging={isDraggingTodo} />}
                      <RefreshIcon
                        onClick={() =>
                          refreshToDoList(
                            tasks,
                            todos,
                            updateTasks,
                            deleteTodos
                          )
                        }
                      />
                      {!isDesktop && (
                        <ArrowIcon
                          onClick={() => {
                            updateVisible(!tasksVisible);
                          }}
                        />
                      )}
                    </Options>
                  </TodoOptions>
                </div>
                <TodoList wakeUpTime={wakeUpTime} />
                {/* at this moment only desktop version has templates */}
                <Templates />
              </TodoContainer>
              <TasksContainer visible={tasksVisible} top={todoTop} />
            </Container>
          )}
        </Application>
      </DragDropContext>
    </main>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const user_email = session?.user?.email;

  const tasks_response = await get_tasks(user_email);
  const todos_response = await get_todos(user_email);
  const templates_response = await get_templates(user_email);

  const db_tasks = tasks_response.data;
  const db_todos = todos_response.data;
  const db_templates = templates_response.data;

  return {
    props: {
      db_tasks,
      db_todos,
      db_templates,
    },
  };
};
