import { PageProps } from "gatsby";
import { graphql } from "gatsby";
import MarkdownPage from "../components/Markdown";
import Post from "../components/Post";
import React from "react";
import Blockquote from "../components/Blockquote";
import DocInfo from "../components/DocInfo";

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      htmlAst
      excerpt
      frontmatter {
        slug
        title
        createAt(formatString: "yyyy-MM-DD")
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
          relativePath
        }
      }
    }
  }
`;

export default function Docs({ data }: PageData) {
  const fm = data.markdownRemark.frontmatter;
  const { latest }: DGitinfo = JSON.parse(data.markdownRemark.fields.gitinfo);

  const unPublish = fm.publish !== true && <Blockquote>这是一篇没有正式发布的草稿，不推荐阅读。</Blockquote>;

  console.log(JSON.parse(data.markdownRemark.fields.gitinfo));

  return (
    <Post desc={fm.desc ?? data.markdownRemark.excerpt} keywords={fm.tags}>
      {unPublish}
      <MarkdownPage heading={fm.title} htmlAst={data.markdownRemark.htmlAst} />
      <DocInfo
        lastModify={latest.date}
        sourceLink={`https://github.com/xxwwp/xxwwp.github.io/blob/main/docs/${data.markdownRemark.parent.relativePath}`}
        tags={fm.tags}
        archives={fm.archives}
        historyLink={`https://github.com/xxwwp/xxwwp.github.io/commits/main/docs/${data.markdownRemark.parent.relativePath}`}
        createAt={data.markdownRemark.frontmatter.createAt}
      />
    </Post>
  );
}

/** 版本项类型 */
interface DVersion {
  version: string;
  link: string;
}

/** md 标题类型 */
interface DHeading {
  depth: number;
  value: string;
}

/** md 的 GraphQL 数据 */
interface DMdx {
  htmlAst: object;
  excerpt: string;
  frontmatter: {
    slug: string;
    title: string;
    createAt: string;
    publish: boolean;
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
    relativePath: string;
  };
}

interface DGitinfoItem {
  authorEmail: string;
  authorName: string;
  html: string;
  date: string;
  hash: string;
  message: string;
}

/** 文章的 git 信息 */
interface DGitinfo {
  all: DGitinfoItem[];
  latest: DGitinfoItem;
  total: number;
}

interface PageData extends PageProps {
  data: {
    markdownRemark: DMdx;
  };
}
