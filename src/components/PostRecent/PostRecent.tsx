import React, { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import { page } from "../../constants/conf";

const H3 = styled.h3``;

const Ul = styled.ul`
  padding-left: 0;
`;
const Li = styled.li`
  list-style: none;
`;

const LinkS = styled(Link)`
  color: ${(p) => p.theme.colors.secondary.main};
  text-decoration: none;
  line-height: 1.5;
  &:active,
  &:hover {
    text-decoration: underline;
  }
`;

interface PostNode {
  createAt: string;
  title: string;
  path: string;
}

interface PostRecentProps extends ComponentPropsWithoutRef<"nav"> {
  list?: PostNode[];
}

export default function PostRecent({ list = [], ...rest }: PostRecentProps) {
  return (
    <nav {...rest}>
      <H3>近期文章</H3>
      <Ul>
        {list.map((v) => (
          <Li key={v.path}>
            <LinkS to={v.path}>
              {v.createAt}：{v.title}
            </LinkS>
          </Li>
        ))}
        <Li key={page.record}>
          <LinkS to={page.record}>...</LinkS>
        </Li>
      </Ul>
    </nav>
  );
}
