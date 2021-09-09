import { PageProps } from "gatsby";
import { graphql } from "gatsby";
import MarkdownPage from "../components/Markdown";
import Post from "../components/Post";
import React from "react";
import Blockquote from "../components/Blockquote";
import DocInfo from "../components/DocInfo";

export const query = graphql`
  query ($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      excerpt
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
      fields {
        gitinfo
      }
      parent {
        ... on File {
          base
        }
      }
    }
  }
`;

export default function Docs({ data }: DData) {
  const fm = data.mdx.frontmatter;
  const { latest }: DGitinfo = JSON.parse(data.mdx.fields.gitinfo);

  const unPublish = fm.publish !== true && <Blockquote>这是一篇没有正式发布的草稿，不推荐阅读。</Blockquote>;

  return (
    <Post desc={fm.desc ?? data.mdx.excerpt} keywords={fm.tags}>
      {unPublish}
      <MarkdownPage heading={fm.title} body={data.mdx.body} />
      <DocInfo
        lastModify={latest.date}
        sourceLink={`https://github.com/xxwwp/xxwwp.github.io/blob/main/docs/${data.mdx.parent.base}`}
        tags={fm.tags}
        archives={fm.archives}
      />
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
  excerpt: string;
  frontmatter: {
    slug: string;
    title: string;
    publish: boolean;
    version?: string;
    desc?: string;
    nextPage?: string;
    prevPage?: string;
    tags?: string[];
    archives?: string[];
  };
  headings: DHeading[];
  fields: {
    gitinfo: string;
  };
  parent: {
    base: string;
  };
}

interface DGitinfoItem {
  authorEmail: string;
  authorName: string;
  body: string;
  date: string;
  hash: string;
  message: string;
}

/** 文章的 git 信息 */
export interface DGitinfo {
  all: DGitinfoItem[];
  latest: DGitinfoItem;
  total: number;
}

export interface DData extends PageProps {
  data: {
    mdx: DMdx;
  };
}
