import { PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Root from "../components/Root/Root";
import Helmet from "react-helmet";

const Content = styled.main`
  padding-top: 200px;
  text-align: center;
  color: ${(p) => p.theme.colors.secondary.refer};
  letter-spacing: 0.8em;
  h1 {
    font-size: 30px;
    font-weight: normal;
  }
`;

interface IndexProps extends PageProps {}

export default function Index({ location }: IndexProps) {
  return (
    <Root>
      <Header location={location} />
      <Helmet title="玄晓乌屋"></Helmet>
      <Content>
        <h1>玄晓乌屋</h1>
        <p>主页建设中...</p>
      </Content>
    </Root>
  );
}
