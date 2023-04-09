import { Task, TasksContext } from "context/tasks/state";
import { TodosContext } from "context/todos/state";
import { useSession } from "next-auth/react";
import { useState, useContext, useEffect } from "react";
import {
  ConfirmTask,
  CreateTaskContainer,
  CreateTaskInput,
  CreateTaskItem,
  CreateTaskItemDuration,
} from "./style";

export interface ITaskForm extends Pick<Task, "text" | "duration"> {
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

  useEffect(() => {
    if (editId) {
      const task = tasks[category].find((task) => task._id === editId);
      const { text, duration, _id } = task;
      setFormState({ text, duration, _id });
    } else {
      setFormState({ ...initialState });
    }
  }, [editId]);

  const handlePress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.type === "click") {
      if (formState.text && formState.duration) {
        if (formState._id) {
          updateTask(formState._id, formState);

          const todos_from_task = todos.filter(
            (todo) => todo.task === formState._id
          );
          todos_from_task.forEach((todo) => {
            updateTodo(todo._id, {
              text: formState.text,
              duration: formState.duration,
            });
          });
        } else {
          const user_email = session?.user?.email;
          addTask(formState, category, user_email);
        }
        setFormVisible(false);
        setFormState({ ...initialState });
      } else {
        if (!formState.text) {
          alert("Please enter a task name");
        } else {
          alert("Please enter a task duration");
        }
      }
    }
  };

  return (
    <CreateTaskContainer>
      <CreateTaskItem onKeyPress={handlePress}>
        <CreateTaskInput
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
        <CreateTaskItemDuration
          value={formState.duration}
          onChange={(e) => {
            setFormState({ ...formState, duration: e.target.value });
          }}
        >
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </CreateTaskItemDuration>
      </CreateTaskItem>
      <ConfirmTask onClick={handlePress} />
    </CreateTaskContainer>
  );
};

export default TaskForm;
