import { PageProps } from "gatsby";
import React from "react";
import Pagination from "../Pagination";
import Root from "../Root/Root";
import Header from "../Header";
import PostList from "../PostList";
import Box from "../Box";

interface PostListPageProps extends PageData {
  baseURL: string;
}

export default function PostListPage({ data, pageContext, baseURL }: PostListPageProps) {
  const list = data.allMarkdownRemark.nodes.map((v) => ({
    path: v.fields.path,
    title: v.frontmatter.title,
    createAt: v.frontmatter.createAt,
    excerpt: v.excerpt,
    tags: v.frontmatter.tags,
    archives: v.frontmatter.archives,
  }));

  const pagination = (
    <nav>
      <Pagination currentPage={pageContext.currentPage} total={pageContext.numPages} baseURL={baseURL} />
    </nav>
  );

  return (
    <Root>
      <Header />
      <Box p={20}>
        {pagination}
        <PostList list={list} />
        {pagination}
      </Box>
    </Root>
  );
}

/** gql 数据 */
interface DData {
  allMarkdownRemark: {
    nodes: {
      excerpt: string;
      fields: {
        path: string;
      };
      frontmatter: {
        title: string;
        createAt: string;
        archives?: string[];
        tags?: string[];
      };
    }[];
  };
}

/** 页面数据 */
export interface PageData extends PageProps {
  data: DData;
  pageContext: {
    limit: number;
    skip: number;
    numPages: number;
    currentPage: number;
  };
}
