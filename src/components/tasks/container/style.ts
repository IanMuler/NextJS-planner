import styled from "styled-components";
import { up } from "styled-breakpoints";
import { theme } from "styles/theme";

export const Container = styled.div<{ visible: boolean; top: number }>`
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
    width: calc(100% - ${theme.todos.list.minWidth} - 12rem);
    height: 80vh;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: ${(props) => props.top}px;
    left: auto;
    right: 4rem;
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
