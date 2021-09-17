import React, { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";

const H3 = styled.h3``;

const Ul = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Li = styled.li<{ depth: number }>`
  padding-left: ${(p) => (p.depth - 1) * 10}px;
`;

const Anchor = styled.a<{ active?: boolean }>`
  font-size: 14px;
  line-height: 2;
  color: ${(p) => (p.active ? p.theme.colors.primary.main : p.theme.colors.text.refer)};
  text-decoration: none;

  &:hover,
  &:active {
    color: ${(p) => p.theme.colors.primary.main};
    filter: brightness(0.8);
  }
`;

interface HeadingNode {
  depth: number;
  value: string;
}

export interface TOCProps extends ComponentPropsWithoutRef<"nav"> {
  toc?: HeadingNode[];
  active?: string;
  deepRender?: number;
}

export default function TOC({ toc, deepRender = 2, active, ...rest }: TOCProps) {
  return (
    <nav {...rest}>
      <H3>目录</H3>
      <Ul>
        {toc?.map(
          (v, i) =>
            deepRender >= v.depth && (
              <Li key={i} depth={v.depth}>
                <Anchor href={`#${v.value}`} active={active === v.value}>
                  {v.value}
                </Anchor>
              </Li>
            )
        )}
      </Ul>
    </nav>
  );
}
