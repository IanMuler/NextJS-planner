import { useState, useContext, useRef, useEffect } from "react";
import {
  Container,
  Create,
  CreateText,
  DeleteIcon,
  Icon,
  NameInput,
  TemplateItem,
  TemplateItems,
  TemplateText,
  Text,
  CloseIcon,
  Modal,
} from "./style";
import { Template, TemplatesContext } from "context/templates/state";
import { ITodosContext, TodosContext } from "context/todos/state";
import { useClickOutside } from "hooks/useClickOutside";
import CreateIcon from "components/create-icon";
import { disassignTasks } from "utils/tasks";
import { TasksContext } from "context/tasks/state";
import { IGeneralContext } from "context/general/state";

interface IComponentProps {
  isDraggingTask: IGeneralContext["isDraggingTask"];
}

const Templates = ({ isDraggingTask }: IComponentProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { templates, addTemplate, deleteTemplate } =
    useContext(TemplatesContext);
  const { todos, addTodos, deleteTodos } = useContext(TodosContext);
  const { tasks, updateTasks } = useContext(TasksContext);

  useClickOutside(ref, () => handleOpen(false));

  const handleOpen = (value: boolean) => {
    setOpen(value);
    form && setForm(false);
    //scroll to top
    if (value) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    //block scroll
    if (!value) {
      document.body.style.overflow = "auto";
    }
    if (value) {
      document.body.style.overflow = "hidden";
    }
  };

  const assignTemplate = async (new_todos: ITodosContext["todos"]) => {
    setOpen(false);
    await deleteTodos(todos.map((todo) => todo._id));
    await addTodos(new_todos);

    const tasks_disassigned = disassignTasks(tasks);
    updateTasks(tasks_disassigned);
  };

  const createTemplate = (name: Template["name"]) => {
    addTemplate(name, todos);
    setForm(false);
  };

  //mobile swipe to show tasks lists still works when modal is open,
  //so we need to close it if we are dragging a task
  useEffect(() => {
    if (isDraggingTask) {
      setOpen(false);
    }
  }, [isDraggingTask]);

  return (
    <>
      {open && (
        <Modal ref={ref}>
          <CloseIcon onTouchEnd={() => handleOpen(false)} />
          <TemplateItems>
            <Create onClick={() => setForm(!form)}>
              <CreateIcon size="sm" />
              <CreateText>Add current list as template</CreateText>
            </Create>
            {form && (
              <NameInput
                type="text"
                placeholder="Template name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    createTemplate(e.currentTarget.value);
                  }
                }}
              />
            )}
            {templates.map((template) => (
              <TemplateItem key={template._id}>
                <TemplateText onClick={() => assignTemplate(template.todos)}>
                  {template.name}
                </TemplateText>
                <DeleteIcon onClick={() => deleteTemplate(template._id)} />
              </TemplateItem>
            ))}
          </TemplateItems>
        </Modal>
      )}
      {!open && (
        <Container onClick={() => handleOpen(true)}>
          <Icon />
          <Text>Templates</Text>
        </Container>
      )}
    </>
  );
};

export default Templates;
