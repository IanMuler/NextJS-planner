import styled from "styled-components";
import { up } from "styled-breakpoints";
import { Refresh } from "@styled-icons/material-sharp";
import { ArrowFromRight } from "@styled-icons/boxicons-solid";
import { theme } from "./theme";

export const Application = styled.div`
  padding: 1rem;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

export const Header = styled.div``;

export const Title = styled.h1`
  font-size: ${theme.font.size.sm.title};
`;

export const Container = styled.div`
  margin-top: 2rem;

  ${up("md")} {
    padding: 0 4rem;
    display: flex;
    gap: 3rem;
  }
`;

export const TodoContainer = styled.div`
  * {
    font-size: ${theme.font.size.sm.task};
  }

  ${up("md")} {
    * {
      font-size: ${theme.font.size.xl.task};
    }

    height: 100%;
    min-width: 25%;
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

  ${up("md")} {
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

  ${up("md")} {
    height: 30px;
  }
`;

export const ArrowIcon = styled(ArrowFromRight)``;

export const RefreshIcon = styled(Refresh)`
  cursor: pointer;
`;

export const RefreshButton = styled.button`
  width: 30px;
  border: none;
  background-color: transparent;
`;

export const TasksContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${(props) => (props.visible ? "0" : "100%")};
  bottom: 0;
  width: 100%;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  transition: left 0.3s ease-in-out;
  z-index: 1;
  overflow-y: auto;

  ${up("md")} {
    height: 80vh;
    display: flex;
    justify-content: space-between;
    position: static;
    background-color: transparent;
    padding: 0;
  }

  &::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 8px 8px #bbbbbec7;
    border: solid 3px transparent;
    border-radius: 10px;
  }
`;
