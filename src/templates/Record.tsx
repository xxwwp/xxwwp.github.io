import { graphql } from "gatsby";
import React from "react";
import { page } from "../constants/conf";
import PostListPage, { PageData } from "../components/PostListPage";

export const query = graphql`
  query ($limit: Int!, $skip: Int!) {
    allMarkdownRemark(
      sort: { fields: frontmatter___createAt, order: DESC }
      limit: $limit
      skip: $skip
      filter: {
        frontmatter: {
          slug: { ne: null }
          title: { ne: null }
          createAt: { ne: null }
          publish: { eq: true }
          obsolete: { ne: true }
        }
      }
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

export default function Draft(pageData: PageData) {
  return <PostListPage title={`记录`} {...pageData} baseURL={page.record + "/"} />;
}
