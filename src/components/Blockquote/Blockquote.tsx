import React from "react";
import { ComponentPropsWithoutRef } from "react";
import styled, { css } from "styled-components";

interface BqSParams {
  // 底色
  baseColor?: string;
  // 背景色
  bgColor?: string;
  // 字体颜色
  color?: string;
}

const BlockquoteS = styled("blockquote")<BqSParams>`
  ${(p) => {
    const baseColor = p.baseColor ?? p.theme.colors.primary.main;
    const bgColor = p.bgColor;
    const color = p.color ?? p.theme.colors.text.refer;
    return css`
      border: 1px solid ${baseColor};
      padding: 0 10px 0 20px;
      margin: 1.2em 0;
      background-color: ${bgColor};
      color: ${color};
      position: relative;
      &::before {
        content: "";
        position: absolute;
        inset: 0 auto 0 0;
        width: 10px;
        background: ${baseColor};
      }
    `;
  }}
`;

interface BlockquoteProps extends ComponentPropsWithoutRef<"blockquote">, BqSParams {}

export default function Blockquote({ children, ...rest }: BlockquoteProps) {
  return <BlockquoteS {...rest}>{children}</BlockquoteS>;
}
