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
import PostRecent from "../components/PostRecent";
import FrontAndBackPages from "../components/FrontAndBackPages/FrontAndBackPages";
import { Disqus } from "gatsby-plugin-disqus";

function UnPublishTip() {
  const c = useTheme().colors;
  return (
    <Blockquote style={{ fontSize: ".9rem" }} baseColor={c.yellow.refer} bgColor={c.bg.refer}>
      <p>这是一篇没有正式发布的草稿，不推荐阅读。</p>
    </Blockquote>
  );
}

function UnCommitTip() {
  const c = useTheme().colors;
  return (
    <Blockquote style={{ fontSize: ".9rem" }} baseColor={c.yellow.refer} bgColor={c.bg.refer}>
      <p>没有找到该文章 git 信息，请确保打包之前对该文章进行提交。</p>
    </Blockquote>
  );
}

function NoLongerValid() {
  const c = useTheme().colors;
  return (
    <Blockquote style={{ fontSize: ".9rem" }} baseColor={c.yellow.refer} bgColor={c.bg.refer}>
      <p>这篇文章已经隐藏，它可能已经废弃或过时，不再有效。</p>
    </Blockquote>
  );
}

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      htmlAst
      excerpt
      frontmatter {
        id
        slug
        title
        createAt(formatString: "yyyy-MM-DD")
        publish
        archives
        desc
        nextPage
        prevPage
        tags
        obsolete
      }
      headings {
        depth
        value
      }
      fields {
        gitinfo
        path
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
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;

export default function Docs({ data, location }: PageData) {
  const fm = data.markdownRemark.frontmatter;
  const site = data.site;
  const { latest }: DGitinfo = JSON.parse(data.markdownRemark.fields.gitinfo);

  const unPublish = fm.publish !== true && <UnPublishTip />;
  const unCommit = latest === null ? <UnCommitTip /> : "";
  const noLongerValid = fm.obsolete === true ? <NoLongerValid /> : "";

  const active = useCurrentHeading();

  const recentPosts = data.allMarkdownRemark.nodes.map((v) => ({ ...v.fields, ...v.frontmatter }));
  const frontAndBackPages = <FrontAndBackPages prev={fm.prevPage} next={fm.nextPage} />;

  return (
    <Post
      desc={fm.desc ?? data.markdownRemark.excerpt}
      keywords={fm.tags}
      aside={
        <>
          {unPublish}
          {unCommit}
          {noLongerValid}
          <TOC deepRender={4} toc={data.markdownRemark.headings} active={active.name}></TOC>
          <PostRecent list={recentPosts}></PostRecent>
        </>
      }
      location={location}
      title={data.markdownRemark.frontmatter.title}
    >
      {frontAndBackPages}
      <Markdown heading={fm.title} htmlAst={data.markdownRemark.htmlAst} />
      {frontAndBackPages}
      <DocInfo
        lastModify={latest?.date}
        sourceLink={`https://github.com/xxwwp/xxwwp.github.io/blob/main/docs/${data.markdownRemark.parent.relativePath}`}
        tags={fm.tags}
        archives={fm.archives}
        historyLink={`https://github.com/xxwwp/xxwwp.github.io/commits/main/docs/${data.markdownRemark.parent.relativePath}`}
        createAt={data.markdownRemark.frontmatter.createAt}
        path={[site.siteMetadata.siteUrl, data.markdownRemark.fields.path].join("")}
      />
      <Disqus
        config={{
          /* Replace PAGE_URL with your post's canonical URL variable */
          url: site.siteMetadata.siteUrl + fm.slug,
          /* Replace PAGE_IDENTIFIER with your page's unique identifier variable */
          identifier: fm.id,
          /* Replace PAGE_TITLE with the title of the page */
          title: fm.title,
        }}
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
    id: string;
    slug: string;
    title: string;
    createAt: string;
    publish: boolean;
    desc?: string;
    nextPage?: string;
    prevPage?: string;
    tags?: string[];
    archives?: string[];
    obsolete?: boolean;
  };
  headings: DHeading[];
  fields: {
    gitinfo: string;
    path: string;
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
    site: {
      siteMetadata: {
        siteUrl: string;
      };
    };
  };
}
