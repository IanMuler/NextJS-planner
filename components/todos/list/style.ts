import { up } from "styled-breakpoints";
import styled from "styled-components";

export const Todos = styled.ul`
  list-style: none;
  border: 1px solid #ccc;
  border-radius: 10px;

  li {
    padding: 1.6rem 2.6rem;
    text-align: center;
    border-radius: 10px;
  }

  ${up("md")} {
    li {
      padding: 1.2rem;
    }
  }
`;

export const NoItems = styled.li`
  color: #999;
`;
