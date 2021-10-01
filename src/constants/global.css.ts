// 全局样式，这个组件并不会默认加载，默认情况下，它仅作为 src/components/Root 组件的全局样式引入
import { createGlobalStyle, css } from "styled-components";

const GlobalStyle = createGlobalStyle`
  ${({ theme: { colors: c } }) => css`
    :root,
    input {
      color: ${c.text.main};
    }
    html {
      overflow: overlay;
    }
    body {
      margin: 0;
    }
    * {
      scroll-behavior: smooth;
    }
    body,
    input {
      background: ${c.bg.main};
    }
  `}
`;

export default GlobalStyle;
