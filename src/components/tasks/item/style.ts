import styled from "styled-components";
import { up } from "styled-breakpoints";
import { Create, Delete, StickyNote2 } from "@styled-icons/material-sharp";
import { theme } from "../../../styles/theme";

export const Container = styled.li`
  padding-bottom: 1rem;
  position: relative;
`;

export const Options = styled.div`
  color: ${theme.colors.black};
  width: 50px;
  display: none;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  gap: 5px;

  > * {
    cursor: pointer;
  }
`;

export const Duration = styled.span`
  width: 50px;
  text-align: center;
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

  &:hover > ${Options} {
    display: flex;
  }

  &:hover > ${Duration} {
    display: none;
  }

  ${up("xl")} {
    font-size: ${theme.font.size.xl.task};
    height: 40px;
    padding: 0 1rem;
  }
`;

export const Text = styled.span`
  width: calc(100% - 50px);
  text-align: center;
  overflow-wrap: break-word;
`;

export const EditIcon = styled(Create)``;
export const DeleteIcon = styled(Delete)``;

export const NotesIcon = styled(StickyNote2)`
  color: ${theme.colors.gray};
  width: 20px;
  cursor: pointer;
`;

export const Notes = styled.div`
  color: ${theme.colors.black};
  position: absolute;
  top: 100%;
  left: 0;
  min-height: 80px;
  min-width: 100%;
  word-break: break-word;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  background-color: ${theme.colors.white};
  font-size: ${theme.font.size.sm.notes};
  z-index: 1;
`;
