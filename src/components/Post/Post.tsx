// 文章组件
import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import Root from "../Root/Root";
import { TOCProps } from "../TOC";
import Header from "../Header";
import { WindowLocation } from "@reach/router";

const miniWidth = "900px";

const Layout = styled.div`
  display: grid;
  max-width: 1200px;
  grid-template-columns: 300px minmax(380px, ${miniWidth});
  column-gap: 20px;

  margin: auto;
  box-sizing: border-box;

  @media screen and (max-width: ${miniWidth}) {
    grid-template-columns: 100%;
    grid-template-rows: auto auto;
    grid-template-areas:
      "_top"
      "_bottom";
    & > :first-child {
      grid-area: _bottom;
    }
  }
`;

const AsideBox = styled.div`
  display: flow-root;
`;

const Aside = styled.aside`
  box-sizing: border-box;
  position: sticky;
  top: 0px;
  max-height: 100vh;
  padding: 0px 25px 100px 20px;
  overflow: auto;
`;

const Main = styled.main`
  padding: 1em;

  // 重新排版 md
  pre[class*="language-"] {
    padding: 1em 1rem;
    margin: 1em -1rem;
    border-radius: 5px;
    @media screen and (max-width: ${miniWidth}) {
      border-radius: 0px;
    }

    @media screen and (min-width: ${miniWidth}) {
      ::-webkit-scrollbar {
        height: 12px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

interface PostProps extends ComponentPropsWithoutRef<"main"> {
  location: WindowLocation;
  desc?: string;
  keywords?: string[];
  aside?: JSX.Element;
  headings?: TOCProps["toc"];
  title?: string;
}

export default function Post({ title, desc, keywords, children, aside, headings, location, ...rest }: PostProps) {
  const baseKeywords = ["玄晓乌屋", "xxww", "xxwwp"];
  const keywordsContent = [...baseKeywords, ...(keywords ?? [])].filter((v) => !!v).join(", ");

  return (
    <Root>
      <Helmet title={title}>
        <meta name="description" content={desc} />
        <meta name="keywords" content={keywordsContent} />
      </Helmet>
      <Header location={location} />
      <Layout>
        <AsideBox>
          <Aside>{aside}</Aside>
        </AsideBox>
        <Main {...rest}>{children}</Main>
      </Layout>
    </Root>
  );
}
