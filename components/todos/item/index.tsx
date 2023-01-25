import { useEffect, useContext } from "react";
import { Item, Start, Text, Duration } from "./style";
import { GeneralContext } from "context/general/state";
import { Todo } from "context/todos/state";

interface IComponentProps {
  todo: Todo;
  isDragging: boolean;
}

const TodoItem = ({ todo, isDragging }: IComponentProps) => {
  const { updateDraggingTodo } = useContext(GeneralContext);

  useEffect(() => {
    updateDraggingTodo(isDragging);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  //When wake up time is like "07:00" it will be converted to "7:00"
  const start: string =
    todo.start?.startsWith("0") && todo.start?.length === 5
      ? todo.start.slice(1)
      : todo.start;

  const { text, duration } = todo;

  return (
    <Item isDragging={isDragging}>
      <Start>{start}</Start>
      <Text>{text}</Text>
      <Duration>{duration.slice(1)}</Duration>
    </Item>
  );
};

export default TodoItem;
