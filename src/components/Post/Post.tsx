// 文章组件
import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import Root from "../Root/Root";
import { TOCProps } from "../TOC";
import Header from "../Header";

const Layout = styled.div`
  display: grid;
  width: 900px;
  grid-template-columns: 280px 600px;
  column-gap: 20px;
  margin: auto;
`;

const AsideBox = styled.div`
  display: flow-root;
`;

const Aside = styled.aside`
  box-sizing: border-box;
  position: sticky;
  top: 0px;
  max-height: 100vh;
  padding: 0px 25px 100px 0;
  overflow: auto;
`;

const Main = styled.main`
  padding: 1em;

  // 重新排版 md
  pre[class*="language-"] {
    padding: 1em 1rem;
    margin: 1em -1rem;
    border-radius: 5px;
    @media screen and (max-width: 632px) {
      border-radius: 0px;
    }

    @media screen and (min-width: 632px) {
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
  desc?: string;
  keywords?: string[];
  aside?: JSX.Element;
  headings?: TOCProps["toc"];
}

export default function Post({ desc, keywords, children, aside, headings, ...rest }: PostProps) {
  const baseKeywords = ["玄晓乌屋", "xxww", "xxwwp"];
  const keywordsContent = [baseKeywords, keywords].filter((v) => !!v).join(", ");

  const title = "1";

  return (
    <Root>
      <Helmet>
        <meta name="description" content={desc} />
        <meta name="keywords" content={keywordsContent} />
      </Helmet>
      <Header />
      <Layout>
        <AsideBox>
          <Aside>{aside}</Aside>
        </AsideBox>
        <Main {...rest}>{children}</Main>
      </Layout>
    </Root>
  );
}
