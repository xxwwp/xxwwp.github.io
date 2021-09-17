import React from "react";
import { ComponentPropsWithoutRef } from "react";
import styled, { css } from "styled-components";

interface BqSParams {
  // 底色
  baseColor?: string;
}

const BlockquoteS = styled("blockquote")<BqSParams>`
  ${(p) => {
    const color = p.baseColor ?? p.theme.colors.primary.main;
    return css`
      background: ${color};
      border: 1px solid ${color};
      padding-left: 10px;
      margin: 1.2em 0;
    `;
  }}
`;

interface ContentParams {
  // 背景色
  bgColor?: string;
  // 字体颜色
  color?: string;
}

const Content = styled("div")<ContentParams>`
  ${(p) => {
    const bg = p.bgColor ?? p.theme.colors.bg.refer;
    return css`
      display: flow-root;
      background: ${bg};
      padding: 0 0.8rem;
      color: ${p.color};
    `;
  }}
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
