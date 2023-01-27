import Head from "next/head";
import { useEffect, useState, useContext, useRef } from "react";
import {
  Container,
  Header,
  Application,
  TimeWakeUp,
  RefreshIcon,
  TodoContainer,
  TodoOptions,
  Options,
  TasksContainer,
  ArrowIcon,
  Title,
} from "styles/Home";
import { handleDragEnd } from "utils/handleDragEnd";
import { DragDropContext } from "react-beautiful-dnd";
import { refreshToDoList } from "utils/todo";
import TodoList from "components/todos/list";
import TaskList from "components/tasks/list";
import { useSwipe } from "hooks/useSwipe";
import { GeneralContext, type IGeneralContext } from "context/general/state";
import DeleteIcon from "components/delete-icon";
import LoadingSpinner from "components/loading-spinner";
import { TasksContext, type ITasksContext } from "context/tasks/state";
import { TodosContext, type ITodosContext } from "context/todos/state";

export interface IContexts {
  general_context: IGeneralContext;
  tasks_context: ITasksContext;
  todos_context: ITodosContext;
}

export default function Home() {
  const general_context = useContext(GeneralContext);
  const tasks_context = useContext(TasksContext);
  const todos_context = useContext(TodosContext);
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
  const { tasks, updateTask, getTasks } = tasks_context;
  const { todos, deleteTodo, getTodos } = todos_context;
  const isDragging = isDraggingTodo || isDraggingTask;
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const todoRef = useRef<HTMLDivElement>(null); //ref to get todo top position to set tasks container fixed position
  const [todoTop, setTodoTop] = useState<number>(0);

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
    updateVisible,
    isDragging
  );

  const contexts: IContexts = {
    general_context,
    tasks_context,
    todos_context,
  };

  useEffect(() => {
    getTasks();
    getTodos();
    getStart();

    if (window?.innerWidth > 768) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update tasks, todos and wakeUpTime in local storage every time they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

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
    <>
      <Head>
        <title>Planner</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://i.imgur.com/L8Ege78.png" />
      </Head>
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
            <Header>
              <Title>Planner</Title>
            </Header>

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
                        {!isDesktop && (
                          <DeleteIcon isDragging={isDraggingTodo} />
                        )}
                        <RefreshIcon
                          onClick={() =>
                            refreshToDoList(
                              tasks,
                              todos,
                              updateTask,
                              deleteTodo
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
                </TodoContainer>
                <TasksContainer visible={tasksVisible} top={todoTop}>
                  <TaskList category="daily" />
                  <TaskList category="weekly" />
                  <TaskList category="other" />
                </TasksContainer>
              </Container>
            )}
          </Application>
        </DragDropContext>
      </main>
    </>
  );
}
