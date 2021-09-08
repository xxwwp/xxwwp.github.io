import React from "react";
import { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";

interface BqSParams {
  // 底色
  baseColor?: string;
}

const BlockquoteS = styled("blockquote")<BqSParams>`
  background: tomato;
  background: ${(p) => p.baseColor};
  padding-left: 10px;
  margin: 1.2em 0;
`;

interface ContentParams {
  // 背景色
  bgColor?: string;
  // 字体颜色
  color?: string;
}

const Content = styled("div")<ContentParams>`
  background: #ffbfb3;
  background: ${(p) => p.bgColor};
  padding: 1rem 0.8rem;
  color: ${(p) => p.color};
`;

interface BlockquoteProps extends ComponentPropsWithoutRef<"blockquote">, BqSParams, ContentParams {}

export default function Blockquote({ children, bgColor, color, ...rest }: BlockquoteProps) {
  return (
    <BlockquoteS {...rest}>
      <Content bgColor={bgColor} color={color}>
        {children}
      </Content>
    </BlockquoteS>
  );
}
