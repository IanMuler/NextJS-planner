import styled from "styled-components";
import { Add } from "@styled-icons/material-sharp";
import { up } from "styled-breakpoints";

export const Container = styled.button<{ size?: number }>`
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ size }) => {
    if (size === "sm") {
      return `
        width: 35px;
        height: 35px;

        ${up("md")} {
          width: 25px;
          height: 25px;
      `;
    } else if (size === "md") {
      return `
      width: 45px;
      height: 45px;
    
      ${up("md")} {
        width: 35px;
        height: 35px;
      }
      `;
    }
  }}
`;

export const Icon = styled(Add)``;

interface IComponentProps {
  onClick?: () => void;
  size?: "sm" | "md";
}

const CreateIcon = ({ onClick, size = "md" }: IComponentProps) => {
  return (
    <Container onClick={onClick} size={size}>
      <Icon />
    </Container>
  );
};

export default CreateIcon;
