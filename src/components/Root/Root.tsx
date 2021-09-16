import React, { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../../constants/global.css";
import Theme from "../../constants/Theme";

interface RootProps {
  children?: ReactNode;
}

export default function Root({ children }: RootProps) {
  return (
    <>
      <ThemeProvider theme={Theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </>
  );
}
