import { useEffect, useContext, useRef, useState } from "react";
import { Item, Start, Text, Duration } from "./style";
import { GeneralContext } from "context/general/state";
import { Todo } from "context/todos/state";
import { Notes, NotesIcon } from "components/tasks/item/style";
import { useClickOutside } from "hooks/useClickOutside";

interface IComponentProps {
  todo: Todo;
  isDragging: boolean;
}

const TodoItem = ({ todo, isDragging }: IComponentProps) => {
  const { updateDraggingTodo } = useContext(GeneralContext);
  const [notesIsOpen, setNotesIsOpen] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);

  useClickOutside(notesRef, () => setNotesIsOpen(false));

  useEffect(() => {
    updateDraggingTodo(isDragging);
  }, [isDragging]);

  //When wake up time is like "07:00" it will be converted to "7:00"
  const start: string =
    todo.start?.startsWith("0") && todo.start?.length === 5
      ? todo.start.slice(1)
      : todo.start;

  const { text, duration } = todo;

  return (
    <Item isDragging={isDragging}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Start>{start}</Start>
        {todo.notes && (
          <>
            <NotesIcon onClick={() => setNotesIsOpen(true)} />
            {notesIsOpen && <Notes ref={notesRef}>{todo.notes}</Notes>}
          </>
        )}
      </div>
      <Text>{text}</Text>
      <Duration>{duration.slice(1)}</Duration>
    </Item>
  );
};

export default TodoItem;
