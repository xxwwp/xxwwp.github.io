import { graphql, PageProps, Link } from "gatsby";
import React from "react";
import styled from "styled-components";
import Pagination from "../components/Pagination";
import PostCard from "../components/PostCard";
import Root from "../components/Root/Root";
import Header from "../components/Header";

const Wrapper = styled.div`
  margin: 20px auto;
  width: 700px;
  min-height: 100vh;
`;

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

const Span = styled.span`
  & ~ & {
    margin-left: 1ex;
  }
`;

export const query = graphql`
  query GetListPost($limit: Int!, $skip: Int!) {
    allMarkdownRemark(
      sort: { fields: frontmatter___createAt, order: DESC }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { slug: { ne: null }, title: { ne: null }, createAt: { ne: null } } }
    ) {
      nodes {
        excerpt
        fields {
          path
        }
        frontmatter {
          title
          archives
          createAt(formatString: "yyyy-MM-DD")
          tags
        }
      }
    }
  }
`;

export default function PostList({ data, pageContext }: PageData) {
  const nav = (
    <nav>
      <Pagination currentPage={pageContext.currentPage} total={pageContext.numPages} />
    </nav>
  );

  return (
    <Root>
      <Header />
      <Wrapper>
        {nav}
        <Ul>
          {data.allMarkdownRemark.nodes.map((v) => (
            <Li key={v.fields.path}>
              <PostCard
                title={v.frontmatter.title}
                path={v.fields.path}
                createAt={v.frontmatter.createAt}
                excerpt={v.excerpt}
                tags={v.frontmatter.tags?.map((v) => (
                  <Span key={v}>{v}</Span>
                ))}
                archives={v.frontmatter.archives?.map((v) => (
                  <Span key={v}>{v}</Span>
                ))}
              />
            </Li>
          ))}
        </Ul>
        {nav}
      </Wrapper>
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
interface PageData extends PageProps {
  data: DData;
  pageContext: {
    limit: number;
    skip: number;
    numPages: number;
    currentPage: number;
  };
}
