import { PageProps } from "gatsby";
import { graphql } from "gatsby";
import Markdown from "../components/Markdown";
import Post from "../components/Post";
import React from "react";
import Blockquote from "../components/Blockquote";
import DocInfo from "../components/DocInfo";
import { useTheme } from "styled-components";
import TOC from "../components/TOC";
import { useCurrentHeading } from "../components/Markdown/H1_6";
import PostList from "../components/PostList";

function UnPublishTip() {
  return (
    <Blockquote style={{ fontSize: ".9rem" }} baseColor={useTheme().colors.secondary.main}>
      <p>这是一篇没有正式发布的草稿，不推荐阅读。</p>
    </Blockquote>
  );
}

function UnCommitTip() {
  return (
    <Blockquote style={{ fontSize: ".9rem" }} baseColor={useTheme().colors.secondary.main}>
      <p>没有找到该文章 git 信息，请确保打包之前对该文章进行提交。</p>
    </Blockquote>
  );
}

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
    allMarkdownRemark(
      filter: { frontmatter: { publish: { eq: true } } }
      sort: { fields: frontmatter___createAt, order: DESC }
      limit: 5
    ) {
      nodes {
        frontmatter {
          createAt(formatString: "yyyy.MM.DD")
          title
        }
        fields {
          path
        }
      }
    }
  }
`;

export default function Docs({ data }: PageData) {
  const fm = data.markdownRemark.frontmatter;
  const { latest }: DGitinfo = JSON.parse(data.markdownRemark.fields.gitinfo);

  const unPublish = fm.publish !== true && <UnPublishTip />;
  const unCommit = latest === null ? <UnCommitTip /> : "";

  const active = useCurrentHeading();

  const recentPosts = data.allMarkdownRemark.nodes.map((v) => ({ ...v.fields, ...v.frontmatter }));

  return (
    <Post
      desc={fm.desc ?? data.markdownRemark.excerpt}
      keywords={fm.tags}
      aside={
        <>
          {unPublish}
          {unCommit}
          <TOC deepRender={4} toc={data.markdownRemark.headings} active={active.name}></TOC>
          <PostList list={recentPosts}></PostList>
        </>
      }
    >
      <Markdown heading={fm.title} htmlAst={data.markdownRemark.htmlAst} />
      <DocInfo
        lastModify={latest?.date}
        sourceLink={`https://github.com/xxwwp/xxwwp.github.io/blob/main/docs/${data.markdownRemark.parent.relativePath}`}
        tags={fm.tags}
        archives={fm.archives}
        historyLink={`https://github.com/xxwwp/xxwwp.github.io/commits/main/docs/${data.markdownRemark.parent.relativePath}`}
        createAt={data.markdownRemark.frontmatter.createAt}
      />
    </Post>
  );
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
    allMarkdownRemark: {
      nodes: {
        frontmatter: {
          createAt: string;
          title: string;
        };
        fields: {
          path: string;
        };
      }[];
    };
  };
}
