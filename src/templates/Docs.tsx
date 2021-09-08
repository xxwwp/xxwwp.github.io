import { PageProps } from "gatsby";
import { graphql } from "gatsby";
import MarkdownPage from "../components/Markdown";
import Post from "../components/Post";
import React, { ReactNode } from "react";
import Blockquote from "../components/Blockquote";

export const query = graphql`
  query ($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        slug
        title
        publish
        archives
        desc
        nextPage
        prevPage
        tags
      }
      headings {
        depth
        value
      }
    }
  }
`;

export default function Docs({ data }: DData) {
  const fm = data.mdx.frontmatter;

  const unPublish = fm.publish !== true && <Blockquote>这是一篇没有正式发布的草稿，不推荐阅读。</Blockquote>;

  return (
    <Post>
      {unPublish}
      <MarkdownPage heading={fm.title} body={data.mdx.body} />
    </Post>
  );
}

/** 版本项类型 */
export interface DVersion {
  version: string;
  link: string;
}

/** md 标题类型 */
export interface DHeading {
  depth: number;
  value: string;
}

/** md 的 GraphQL 数据 */
export interface DMdx {
  body: string;
  frontmatter: {
    slug: string;
    title: string;
    createAt: string;
    publish: boolean;
    version?: string;
    desc?: string;
    nextPage?: string;
    prevPage?: string;
    obsolete?: DVersion[];
    tags?: string[];
    archives?: string[];
  };
  headings: DHeading[];
}

export interface DData extends PageProps {
  data: {
    mdx: DMdx;
  };
}
