// 文章组件
import React, { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";

const Main = styled.main`
  max-width: 1000px;
  margin-left: auto;
  margin-right: 10%;
`;

interface PostProps extends ComponentPropsWithoutRef<"main"> {}

export default function Post(props: PostProps) {
  return <Main {...props} />;
}
