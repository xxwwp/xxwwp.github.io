import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import PostCard from "../PostCard";

const Ul = styled.ul`
  padding-left: 0;
`;

const Li = styled.li`
  list-style: none;
  & ~ & {
    margin-top: 5px;
    border-top: 1px solid #eee;
    padding-top: 5px;
  }
`;

const Tag = styled.span``;

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

interface PostListProps extends ComponentPropsWithoutRef<"nav"> {
  list?: Array<{
    path: string;
    title: ReactNode;
    createAt: ReactNode;
    excerpt?: string;
    tags?: ReactNode[];
    archives?: ReactNode[];
  }>;
}

export default function PostList({ list = [], ...rest }: PostListProps) {
  return (
    <Ul>
      {list.map((v) => (
        <Li key={v.path}>
          <PostCard
            title={v.title}
            path={v.path}
            createAt={v.createAt}
            excerpt={v.excerpt}
            tags={v.tags?.map((v, i) => (
              <Tag key={i}>{v} &nbsp;</Tag>
            ))}
            archives={v.archives?.map((v, i) => (
              <Tag key={i}>{v} &nbsp;</Tag>
            ))}
          />
        </Li>
      ))}
    </Ul>
  );
}
