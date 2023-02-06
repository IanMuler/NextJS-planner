import { useState, useContext, useEffect, useRef } from "react";
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
} from "./style";
import { Template, TemplatesContext } from "context/templates/state";
import { ITodosContext, TodosContext } from "context/todos/state";
import { useClickOutside } from "hooks/useClickOutside";
import CreateIcon from "components/create-icon";
import { disassignTasks } from "utils/tasks";
import { TasksContext } from "context/tasks/state";

const Templates = () => {
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
  };

  const assignTemplate = (new_todos: ITodosContext["todos"]) => {
    deleteTodos(todos.map((todo) => todo._id));
    addTodos(new_todos);

    const tasks_disassigned = disassignTasks(tasks);
    updateTasks(tasks_disassigned);

    setOpen(false);
  };

  const createTemplate = (name: Template["name"]) => {
    addTemplate(name, todos);
    setForm(false);
  };

  return (
    <Container
      open={open}
      onClick={() => (!open ? setOpen(true) : null)}
      ref={ref}
    >
      {open && (
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
      )}
      {!open && (
        <>
          <Icon />
          <Text>Templates</Text>
        </>
      )}
    </Container>
  );
};

export default Templates;
