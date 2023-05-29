import { Task, TasksContext } from "context/tasks/state";
import { TodosContext } from "context/todos/state";
import { useSession } from "next-auth/react";
import { useState, useContext, useEffect, useCallback } from "react";
import { ConfirmTask, Container, Input, Item, Duration, Notes } from "./style";

export interface ITaskForm extends Pick<Task, "text" | "duration" | "notes"> {
  _id?: Task["_id"];
}

interface IComponentProps {
  editId?: Task["_id"];
  category?: Task["category"];
  setFormVisible: (value: boolean) => void;
}

const TaskForm = ({ editId, category, setFormVisible }: IComponentProps) => {
  const initialState: ITaskForm = {
    text: "",
    duration: "",
    notes: "",
  };

  const { data: session } = useSession();
  const [formState, setFormState] = useState<ITaskForm>(initialState);
  const { todos, updateTodo } = useContext(TodosContext);
  const { tasks, updateTask, addTask } = useContext(TasksContext);

  const selectOptions: string[] = [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
  ];

  // Set the form state when the component mounts or editId changes
  useEffect(() => {
    if (editId) {
      const task = tasks[category].find((task) => task._id === editId);
      const { text, duration, notes, _id } = task;
      setFormState({ text, duration, notes, _id });
    } else {
      setFormState({ ...initialState });
    }
  }, [editId]);

  const validateForm = () => {
    if (!formState.text) {
      alert("Please enter a task name");
      return false;
    }
    if (!formState.duration) {
      alert("Please enter a task duration");
      return false;
    }
    return true;
  };

  const updateOrCreateTask = () => {
    if (formState._id) {
      // If the form has an id, it means that we are editing a task
      updateTask(formState._id, formState);
      // Update todos related to the task
      const todos_from_task = todos.filter(
        (todo) => todo.task === formState._id
      );
      todos_from_task.forEach((todo) => {
        const { _id, ...rest } = formState; // Remove the _id from the formState
        updateTodo(todo._id, {
          ...rest,
        });
      });
    } else {
      const user_email = session?.user?.email;
      addTask(formState, category, user_email);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      updateOrCreateTask();
      setFormVisible(false);
      setFormState({ ...initialState });
    }
  };

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleClick = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <Container>
      <Item onKeyPress={handleKeyPress}>
        <Input
          value={formState.text}
          type="text"
          id="name"
          name="name"
          autoComplete="off"
          placeholder="Write a task"
          onChange={(e) => {
            setFormState({ ...formState, text: e.target.value });
          }}
        />
        <Duration
          value={formState.duration}
          onChange={(e) => {
            setFormState({ ...formState, duration: e.target.value });
          }}
        >
          <option value="" hidden disabled>
            Duration
          </option>
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Duration>
        <Notes //text area for notes
          value={formState.notes}
          type="text"
          id="notes"
          name="notes"
          autoComplete="off"
          placeholder="Add notes"
          onChange={(e) => {
            setFormState({ ...formState, notes: e.target.value });
            console.log(formState);
          }}
        />
      </Item>
      <ConfirmTask onClick={handleClick} />
    </Container>
  );
};

export default TaskForm;
