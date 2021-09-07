import { PageProps } from "gatsby";
import { graphql } from "gatsby";
import MarkdownPage from "../components/Markdown";
import Post from "../components/Post";
import React from "react";

export const query = graphql`
  query ($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        createAt
        slug
        title
        publish
        archives
        obsolete {
          version
          link
        }
        desc
        nextPage
        prevPage
        tags
        updateAt
        version
      }
      headings {
        depth
        value
      }
    }
  }
`;

function Docs({ data }: DData) {
  return (
    <Post>
      <MarkdownPage data={data.mdx} />
    </Post>
  );
}

export default Docs;

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
    updateAt: string | null;
    publish: boolean;
    version: string | null;
    desc: string | null;
    nextPage: string | null;
    prevPage: string | null;
    obsolete: DVersion[] | null;
    tags: string[] | null;
    archives: string[] | null;
  };
  headings: DHeading[];
}

export interface DData extends PageProps {
  data: {
    mdx: DMdx;
  };
}
