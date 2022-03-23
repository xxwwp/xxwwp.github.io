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

  // 小屏幕让侧边栏和内容使用常规流布局
  @media screen and (max-width: ${miniWidth}) {
    display: block;
  }
`;

const AsideBox = styled.div`
  display: flow-root;
  box-sizing: border-box;
  position: sticky;
  top: 0px;
  padding: 0px 25px 100px 20px;
  max-height: 100vh;
  overflow: auto;

  // 小屏幕关闭侧边栏粘性布局
  @media screen and (max-width: ${miniWidth}) {
    max-height: none;
    position: static;
  }
`;

const Main = styled.main`
  padding: 1em;

  // 重新排版 md 的代码样式
  .renderAst > div > .gatsby-highlight > pre[class*="language-"] {
    padding: 1em 1rem;
    margin: 1em -1rem;
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

  pre[class*="language-"] {
    border-radius: 5px;
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
        <AsideBox>{aside}</AsideBox>
        <Main {...rest}>{children}</Main>
      </Layout>
    </Root>
  );
}
