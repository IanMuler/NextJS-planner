import styled, { keyframes } from "styled-components";
import { Archive } from "@styled-icons/evil/Archive";
import { Delete } from "@styled-icons/material-sharp/Delete";
import { Close } from "@styled-icons/material-sharp/Close";
import { up } from "styled-breakpoints";
import { theme } from "styles/theme";

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #999;
`;

const fade_in = keyframes`
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
`;

export const Modal = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - ${theme.height.header});
  background-color: rgba(0, 0, 0, 0.5);
  animation: ${fade_in} 0.5s ease-in-out;

  ${up("xl")} {
    width: calc(25% + 4rem);
  }
`;

export const Create = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  align-self: flex-start;
  margin-bottom: 2rem;
`;

export const CreateText = styled.span`
  font-size: 1.8rem;
  font-weight: 100;
  color: #ffffff;
`;

export const NameInput = styled.input`
  width: 100%;
  text-align: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  background: #ffffff;

  &:focus {
    outline: none;
  }
`;

export const TemplateItems = styled.ul`
  width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export const DeleteIcon = styled(Delete)`
  height: 25px;
  pointer-events: none;
  opacity: 0;
`;

export const TemplateItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: #ffffff;
  border-radius: 10px;

  &:hover > ${DeleteIcon} {
    opacity: 1;
    pointer-events: all;
  }
`;

export const TemplateText = styled.span`
  width: 100%;
  text-align: center;
`;

export const Icon = styled(Archive)`
  width: 25px;
  height: 25px;
`;

export const Text = styled.span`
  font-size: 17px;
  font-weight: 100;
`;

export const CloseIcon = styled(Close)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.5);

  ${up("xl")} {
    display: none;
  }
`;
