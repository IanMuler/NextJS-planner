import { useContext, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskItem from "../item";
import {
  Container,
  CreateTask,
  CreateIcon,
  Title,
  Tasks,
  Header,
} from "./style";
import { Task, TasksContext } from "context/tasks/state";
import TaskForm from "../form";

interface IComponentProps {
  category: Task["category"];
}

const TaskList = ({ category }: IComponentProps) => {
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<Task["id"] | null>(null);
  const { tasks } = useContext(TasksContext);

  const setEditForm = (id: Task["id"]) => {
    setEditId(id);
    setFormVisible(true);
  };

  return (
    <Droppable droppableId={category}>
      {(droppableProvided) => (
        <Container
          {...droppableProvided.droppableProps}
          ref={droppableProvided.innerRef}
        >
          <Header>
            <Title>
              {/* first letter capitalized */}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Title>
            <CreateTask
              onClick={() => {
                setFormVisible(!formVisible);
                setEditId(null);
              }}
            >
              <CreateIcon />
            </CreateTask>
          </Header>

          {formVisible && (
            <TaskForm
              editId={editId}
              category={category}
              setFormVisible={setFormVisible}
            />
          )}
          <Tasks>
            {tasks[category].map((task, index) => (
              <Draggable
                key={task.draggableId}
                draggableId={task.draggableId}
                index={index}
              >
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    {...draggableProvided.draggableProps}
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.dragHandleProps}
                  >
                    <TaskItem
                      task={task}
                      setEditForm={setEditForm}
                      isDragging={draggableSnapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </Tasks>
        </Container>
      )}
    </Droppable>
  );
};

export default TaskList;
