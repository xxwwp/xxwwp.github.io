import React, { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../../constants/global.css";
import Theme from "../../constants/Theme";
import Helmet from "react-helmet";
import Header from "../Header";

interface RootProps {
  children?: ReactNode;
}

export default function Root({ children }: RootProps) {
  return (
    <>
      <ThemeProvider theme={Theme}>
        <GlobalStyle />
        <Helmet
          htmlAttributes={{
            lang: "zh-hans",
          }}
        >
          <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        </Helmet>
        {children}
      </ThemeProvider>
    </>
  );
}
