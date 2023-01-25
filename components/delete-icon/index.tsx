import { createRef } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { Delete } from "@styled-icons/material-sharp";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${theme.colors.gradient};
  opacity: ${(props) => (props.isDragging ? 0.6 : 0)};
  z-index: ${(props) => (props.isDragging ? 1 : -1)};
  transition: all 0.3s ease-in-out;
`;

const Icon = styled(Delete)`
  position: fixed;
  width: 50px;
  height: 50px;
  color: ${theme.colors.white};
`;

interface IComponentProps {
  isDragging: boolean;
}

const DeleteIcon = ({ isDragging }: IComponentProps) => {
  const iconRef = createRef<HTMLDivElement>();

  return (
    <Droppable droppableId="delete">
      {(provided) => (
        <Container ref={provided.innerRef} isDragging={isDragging}>
          {isDragging && <Icon ref={iconRef} />}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
};

export default DeleteIcon;
