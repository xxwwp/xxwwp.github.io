import React, { ComponentPropsWithoutRef, Fragment, ReactNode } from "react";
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
              <Fragment key={i}>{v} &nbsp;</Fragment>
            ))}
            archives={v.archives?.map((v, i) => (
              <Fragment key={i}>{v} &nbsp;</Fragment>
            ))}
          />
        </Li>
      ))}
    </Ul>
  );
}
