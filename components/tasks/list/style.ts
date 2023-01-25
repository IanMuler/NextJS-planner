import styled from "styled-components";
import { up } from "styled-breakpoints";
import { Add } from "@styled-icons/material-sharp";
import { theme } from "../../../styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${up("md")} {
    width: 30%;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 2rem;
`;

export const Title = styled.h2`
  font-size: ${theme.font.size.sm.category};
`;

export const CreateTask = styled.button`
  width: 45px;
  height: 45px;
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  ${up("md")} {
    width: 35px;
    height: 35px;
  }
`;

export const CreateIcon = styled(Add)``;

export const Tasks = styled.ul`
  list-style: none;
`;
