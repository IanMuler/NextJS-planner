import styled from "styled-components";
// @styled-icons/evil/Archive
import { Archive } from "@styled-icons/evil/Archive";
import { Delete } from "@styled-icons/material-sharp/Delete";

export const Container = styled.div<{ open: boolean }>`
  display: inline-flex;
  width: min-content;
  align-items: center;
  padding: 0.5rem 1rem;

  ${({ open }) => {
    if (open) {
      return `
             flex-direction: column;
             justify-content: center;
             position: absolute;
             top: 0;
             left: 0;
             width: calc(25% + 4rem);
             height: 100%;
             background-color: rgba(0, 0, 0, 0.5);
             animation: fade-in 0.5s ease-in-out;

                @keyframes fade-in {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
             `;
    } else {
      return `
                cursor: pointer;
                color: #999;
            `;
    }
  }}
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
  font-size: 17px;
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
