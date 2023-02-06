import TaskList from "../list";
import { Container } from "./style";

const TasksContainer = ({ visible, top }) => {
  return (
    <Container visible={visible} top={top}>
      <TaskList category="daily" />
      <TaskList category="weekly" />
      <TaskList category="other" />
    </Container>
  );
};

export default TasksContainer;
