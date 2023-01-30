import { TasksContext } from "context/tasks/state";
import { useContext, useEffect } from "react";
import TaskList from "../list";
import { Container } from "./style";

const TasksContainer = ({ visible, top }) => {
  const { tasks, getTasks } = useContext(TasksContext);

  useEffect(() => {
    getTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <Container visible={visible} top={top}>
      <TaskList category="daily" />
      <TaskList category="weekly" />
      <TaskList category="other" />
    </Container>
  );
};

export default TasksContainer;
