import styled from "styled-components";

export const Item = styled.li<{ isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isDragging }) => (isDragging ? "#f5f5f58a" : "")};
`;

export const Duration = styled.span`
  width: 50px;
`;

export const Start = styled.span`
  width: 50px;
`;

export const Text = styled.span`
  overflow-wrap: break-word;
`;
