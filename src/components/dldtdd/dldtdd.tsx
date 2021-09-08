import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

interface BaseProps {
  inline?: boolean;
}

const inlineStyle = (p: BaseProps) =>
  p.inline &&
  css`
    display: inline;
    margin-left: 0;
    margin-right: 1em;
  `;

export const Dl = styled.dl<BaseProps>`
  margin: 1.2rem 0;
  ${(p) =>
    p.inline &&
    css`
      dd {
        display: inline;
        margin-left: 0;
        margin-right: 1em;
      }
    `}
`;

export const Dt = styled.dt<BaseProps>`
  font-weight: bold;
  margin: 0.8rem 0;
`;

export const Dd = styled.dd`
  margin: 0.2rem 0 0.2rem 1em;
  color: #666;
  font-size: 0.9rem;
`;

interface DItemProps<T = string> extends BaseProps {
  title?: string;
  values?: T[];
  render: (v: T, index: number) => ReactNode;
}

/**
 * 渲染列表 dl item，每组数据由一个 dt 加多个 dd 组成
 * @param props
 * @param props.title 标题
 * @param props.values 列表
 * @param props.render 渲染列表中值的渲染函数
 */
export function DItem<T = string>({ title, values, render, inline }: DItemProps<T>) {
  return (
    <>
      <Dt>{title}</Dt>
      {values?.map((v, i) => (
        <Dd key={i}>{render(v, i)}</Dd>
      ))}
    </>
  );
}
