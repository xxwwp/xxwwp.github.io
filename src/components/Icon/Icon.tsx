import styled from "styled-components";

interface IconParams {
  fill?: string;
  size?: string;
  vertical?: string;
}

const Icon = styled.span<IconParams>`
  display: inline-block;
  vertical-align: ${(p) => p.vertical};
  svg {
    fill: ${(p) => p.fill};
    width: ${(p) => p.size ?? "1rem"};
    height: ${(p) => p.size ?? "1rem"};
  }
`;

export default Icon;
