import styled from "styled-components";
import { up } from "styled-breakpoints";
import { Refresh } from "@styled-icons/material-sharp";
import { ArrowFromRight } from "@styled-icons/boxicons-solid";
import { theme } from "./theme";

export const Application = styled.div`
  padding: 1rem;
  min-height: calc(100vh - ${theme.height.header});
  position: relative;
  overflow: hidden;
`;

export const Container = styled.div`
  margin-top: 2rem;

  ${up("xl")} {
    padding: 0 4rem;
    display: flex;
    gap: 3rem;
  }
`;

export const TodoContainer = styled.div`
  * {
    font-size: ${theme.font.size.sm.task};
  }

  ${up("xl")} {
    * {
      font-size: ${theme.font.size.xl.task};
    }

    height: 100%;
    min-width: ${theme.todos.list.minWidth};
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
`;

export const TodoOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  ${up("xl")} {
  }
`;

export const TimeWakeUp = styled.input`
  max-width: 30%;
  min-width: 100px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Options = styled.div`
  height: 40px;
  display: flex;
  align-items: space-between;
  gap: 1rem;

  ${up("xl")} {
    height: 30px;
  }
`;

export const ArrowIcon = styled(ArrowFromRight)``;

export const RefreshIcon = styled(Refresh)`
  cursor: pointer;
`;
