import React from "react";
import { ComponentPropsWithoutRef } from "react";
import styled, { css } from "styled-components";

type Length = string | number | number[];

function length(len?: Length) {
  if (!len) return;

  if (typeof len === "string") return len;

  if (typeof len === "number") return len + "px";

  return len.join("px ") + "px";
}

interface BoxStyleProps {
  /** 盒子大小 */
  size?: "mini" | "normal" | "large" | "large+" | "fill";
  /** margin 值，默认为 auto */
  m?: Length;
  /** padding 值*/
  p?: Length;
}

const BoxStyle = styled.div<BoxStyleProps>`
  margin: ${(p) => length(p.m) || "auto"};
  padding: ${(p) => length(p.p)};
  ${({ size }) =>
    size === "mini"
      ? css`
          max-width: 600px;
        `
      : size === "normal" || !size
      ? css`
          max-width: 800px;
        `
      : size === "large"
      ? css`
          max-width: 1000px;
        `
      : size === "large+"
      ? css`
          max-width: 1200px;
        `
      : ""}
`;

interface BoxProps extends ComponentPropsWithoutRef<"div">, BoxStyleProps {}

export default function Box({ size, ...rest }: BoxProps) {
  return <BoxStyle size={size} {...rest} />;
}
