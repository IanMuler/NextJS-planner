import styled from "styled-components";
import { up } from "styled-breakpoints";
import { CheckCircleOutline, Add } from "@styled-icons/material-sharp";
import { theme } from "../../../styles/theme";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  * {
    font-size: ${theme.font.size.sm.task};
  }

  ${up("md")} {
    * {
      font-size: ${theme.font.size.xl.task};
    }
  }
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1rem;
  width: 80%;
  background-color: #f0eeeb;
  border-radius: 10px;

  ${up("md")} {
    padding: 0.6rem 1rem;
`;

export const Input = styled.input`
  background-color: transparent;
  border: none;
  text-align: center;

  &:focus {
    outline: none;
  }
`;

export const Duration = styled.select`
  text-align: center;
  padding: 0.5rem;
  background-color: transparent;
  border: none;
`;

export const Notes = styled.textarea`
  background-color: transparent;
  border: none;
  text-align: center;
  font-size: ${theme.font.size.sm.notes};
  resize: none;
  height: 2rem;
  cursor: pointer;

  &::placeholder {
    color: #7e7ec7;
  }

  &:focus {
    background-color: ${theme.colors.white};
    outline: none;
    border-radius: 10px;
    border: none;
    text-align: center;
    resize: none;
    padding: 0.5rem;
    height: 4rem;

    &::placeholder {
      color: transparent;
    }
  }
`;

export const ConfirmTask = styled(CheckCircleOutline)`
  width: 50px;
  height: 50px;
  margin: auto;
  color: #6cd66cb0;

  ${up("md")} {
    width: 35px;
    height: 35px;
  }
`;
