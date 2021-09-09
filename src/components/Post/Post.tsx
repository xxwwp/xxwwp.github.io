// 文章组件
import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";

const Main = styled.main`
  max-width: 1000px;
  margin-left: auto;
  margin-right: 10%;
`;

interface PostProps extends ComponentPropsWithoutRef<"main"> {
  desc?: string;
  keywords?: string[];
}

export default function Post({ children, desc, keywords, ...rest }: PostProps) {
  const baseKeywords = ["玄晓乌屋", "xxww", "xxwwp"];
  const keywordsContent = [baseKeywords, keywords].filter((v) => !!v).join(", ");

  return (
    <Main {...rest}>
      <Helmet>
        <meta name="description" content={desc} />
        <meta name="keywords" content={keywordsContent} />
      </Helmet>
      {children}
    </Main>
  );
}
