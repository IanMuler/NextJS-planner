import { useContext, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Todos, NoItems } from "./style";
import TodoItem from "../item";
import { addWakeUpTime } from "utils/todo";
import { TodosContext } from "context/todos/state";

const TodoList = ({ wakeUpTime }) => {
  const { todos, updateTodo } = useContext(TodosContext);

  useEffect(() => {
    if (todos.length > 0) addWakeUpTime(todos, updateTodo, wakeUpTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos, wakeUpTime]);

  return (
    <Droppable droppableId="todo">
      {(droppableProvided) => (
        <Todos
          {...droppableProvided.droppableProps}
          ref={droppableProvided.innerRef}
        >
          {todos.length > 0 &&
            todos.map((todo, index) => (
              <Draggable
                key={todo.draggableId}
                draggableId={todo.draggableId}
                index={index}
                // isDragDisabled={refreshing}
              >
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    {...draggableProvided.draggableProps}
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.dragHandleProps}
                  >
                    <TodoItem
                      todo={todo}
                      isDragging={draggableSnapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
          {todos.length === 0 && <NoItems>Drag tasks here</NoItems>}
          {droppableProvided.placeholder}
        </Todos>
      )}
    </Droppable>
  );
};

export default TodoList;
