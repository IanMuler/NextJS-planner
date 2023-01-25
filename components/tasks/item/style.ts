import styled from "styled-components";
import { up } from "styled-breakpoints";
import { Create, Delete } from "@styled-icons/material-sharp";
import { theme } from "../../../styles/theme";

export const Container = styled.li`
  padding-bottom: 1rem;
`;

export const Item = styled.div<{ assigned: boolean }>`
  font-size: ${theme.font.size.sm.task};
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => (props.assigned ? "#cccccc" : "#e6e4e1")};
  color: ${(props) => (props.assigned ? "#ababab" : "inherit")};
  border-radius: 10px;

  ${up("md")} {
    font-size: ${theme.font.size.xl.task};
    height: 40px;
    padding: 0 1rem;
  }
`;

export const Duration = styled.span`
  width: 50px;
  text-align: center;
`;

export const Text = styled.span`
  width: calc(100% - 50px);
  text-align: center;
  overflow-wrap: break-word;
`;

export const Options = styled.div`
  color: #000;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  gap: 5px;

  > * {
    cursor: pointer;
  }
`;

export const EditIcon = styled(Create)``;
export const DeleteIcon = styled(Delete)``;
