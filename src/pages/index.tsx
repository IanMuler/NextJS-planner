// Built-in and third-party modules
import React, { useContext } from "react";
import { useSession } from "next-auth/react";
import { DragDropContext } from "react-beautiful-dnd";
import { NextPage } from "next";

// Components
import TodoList from "components/todos/list";
import TasksContainer from "components/tasks/container";
import Templates from "components/templates";
import DeleteIcon from "components/delete-icon";
import LoadingSpinner from "components/loading-spinner";

// Contexts
import { GeneralContext, IGeneralContext } from "context/general/state";
import { ITasksContext, TasksContext } from "context/tasks/state";
import { ITodosContext, TodosContext } from "context/todos/state";
import { ITemplatesContext, TemplatesContext } from "context/templates/state";

// Hooks
import { useSwipe } from "hooks/useSwipe";
import { useHomeLogic } from "hooks/useHomeLogic";

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
import { refreshToDoList } from "utils/todo";

export interface IContexts {
  general_context: IGeneralContext;
  tasks_context: ITasksContext;
  todos_context: ITodosContext;
  templates_context: ITemplatesContext;
}

const Home: NextPage = () => {
  const { data: session } = useSession();
  const general_context = useContext(GeneralContext);
  const tasks_context = useContext(TasksContext);
  const todos_context = useContext(TodosContext);
  const templates_context = useContext(TemplatesContext);

  const contexts: IContexts = {
    general_context,
    tasks_context,
    todos_context,
    templates_context,
  };

  const {
    todoRef,
    isLoading,
    isDesktop,
    isDraggingTodo,
    isDraggingTask,
    tasksVisible,
    wakeUpTime,
    handleWakeUpTime,
    handleDragEnd,
  } = useHomeLogic(session, contexts);

  // Swipe logic for tasks container on mobile
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
    general_context.updateVisible,
    isDraggingTodo || general_context.isDraggingTask
  );

  // Calculate the `top` value here to pass into TasksContainer
  const todoTop = todoRef.current?.getBoundingClientRect().top ?? 0;

  return (
    <main>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Application
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {isLoading && (
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
          {!isLoading && (
            <Container>
              <TodoContainer>
                <div ref={todoRef}>
                  <TodoOptions>
                    <TimeWakeUp
                      value={wakeUpTime}
                      type="time"
                      onChange={handleWakeUpTime}
                    />
                    <Options>
                      {!isDesktop && <DeleteIcon isDragging={isDraggingTodo} />}
                      <RefreshIcon
                        onClick={() =>
                          refreshToDoList(
                            tasks_context.tasks,
                            todos_context.todos,
                            tasks_context.updateTasks,
                            todos_context.deleteTodos
                          )
                        }
                      />
                      {!isDesktop && (
                        <ArrowIcon
                          onClick={() => {
                            general_context.updateVisible(!tasksVisible);
                          }}
                        />
                      )}
                    </Options>
                  </TodoOptions>
                </div>
                <TodoList wakeUpTime={wakeUpTime} />
                {/* at this moment only desktop version has templates */}
                <Templates isDraggingTask={isDraggingTask} />
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
