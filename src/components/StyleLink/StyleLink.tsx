import { Link } from "gatsby";
import styled from "styled-components";

const StyleLink = styled(Link)`
  color: ${(p) => p.theme.colors.primary.main};
  text-decoration: none;

  &:hover {
    filter: brightness(1.3);
  }
`;

export default StyleLink;
