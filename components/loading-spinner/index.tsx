import styled, { keyframes } from "styled-components";
import { Spinner2 } from "@styled-icons/evil/Spinner2";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled(Spinner2)`
  animation: ${rotate360} 1s linear infinite;
  color: ${(props) => props.color || "black"};
  width: ${(props) => props.width || "60px"};
  height: ${(props) => props.height || "60px"};
`;

export default LoadingSpinner;
