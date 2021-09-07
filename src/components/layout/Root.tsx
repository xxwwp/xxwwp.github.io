import React, { ReactNode } from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  html,
  body {
    overflow-x: hidden;
  }
`;

export interface RootProps {
  children: ReactNode;
  helmet?: ReactNode;
}

export default function Root({ children, helmet = "" }: RootProps) {
  return (
    <React.Fragment>
      <GlobalStyle />
      {children}
    </React.Fragment>
  );
}
