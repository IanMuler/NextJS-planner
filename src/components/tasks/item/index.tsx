import { GeneralContext } from "context/general/state";
import { TasksContext } from "context/tasks/state";
import { TodosContext } from "context/todos/state";
import { useState, useContext, useEffect } from "react";
import { Task } from "context/tasks/state";
import {
  Item,
  Duration,
  Text,
  Options,
  EditIcon,
  DeleteIcon,
  Container,
} from "./style";

interface IComponentProps {
  setEditForm: (id: Task["id"]) => void;
  task: Task;
  isDragging: boolean;
}

const TaskItem = ({ task, setEditForm, isDragging }: IComponentProps) => {
  const [hover, setHover] = useState<boolean>(false);
  const { deleteTask } = useContext(TasksContext);
  const { deleteTodo } = useContext(TodosContext);
  const { updateDraggingTask, updateVisible } = useContext(GeneralContext);

  useEffect(() => {
    updateDraggingTask(isDragging);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const handleDelete = (id: Task["id"]) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
      if (task.assigned) deleteTodo(id);
    }
  };

  return (
    <Container>
      {/* Container is important for draggable movement fluidity, 
      to Item cannot be added margin-bottom so padding-bottom will be added here  */}
      <Item
        assigned={task.assigned}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchMove={() => isDragging && updateVisible(false)}
      >
        <Text>{task.text}</Text>
        {hover && (
          <Options>
            <EditIcon
              onClick={() => {
                setEditForm(task.id);
              }}
            />
            <DeleteIcon
              onClick={() => {
                handleDelete(task.id);
              }}
            />
          </Options>
        )}
        {!hover && (
          <Duration>
            {task.duration !== "00:00" ? task.duration.slice(1) : null}
          </Duration>
        )}
      </Item>
    </Container>
  );
};

export default TaskItem;
