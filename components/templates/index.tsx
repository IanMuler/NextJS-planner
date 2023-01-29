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

const Templates = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(false);
  const { templates, getTemplates, addTemplate, deleteTemplate } =
    useContext(TemplatesContext);
  const { todos, updateTodos } = useContext(TodosContext);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => handleOpen(false));

  const handleOpen = (value: boolean) => {
    setOpen(value);
    form && setForm(false);
  };

  const assignTemplate = (todos: ITodosContext["todos"]) => {
    updateTodos(todos);
    setOpen(false);
  };

  const createTemplate = (name: Template["name"]) => {
    addTemplate(name, todos);
    setForm(false);
  };

  useEffect(() => {
    getTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("templates", JSON.stringify(templates));
  }, [templates]);

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
            <CreateText>Add actual list as template</CreateText>
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
            <TemplateItem key={template.id}>
              <TemplateText onClick={() => assignTemplate(template.todos)}>
                {template.name}
              </TemplateText>
              <DeleteIcon onClick={() => deleteTemplate(template.id)} />
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
