// 文章组件
import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import styled from "styled-components";

const Main = styled.main`
  max-width: 1000px;
  margin-left: auto;
  margin-right: 10%;
`;

interface PostProps extends ComponentPropsWithoutRef<"main"> {
  desc?: ReactNode;
}

export default function Post({ children, desc, ...rest }: PostProps) {
  return <Main {...rest}>{children}</Main>;
}
