import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Global, css } from "@emotion/react";

const globalCss = css`
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
      <Global styles={globalCss}></Global>
      <Helmet />
    </React.Fragment>
  );
}
