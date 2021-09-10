import { graphql, PageProps, Link } from "gatsby";
import React from "react";
import Pagination from "../components/Pagination";

export const query = graphql`
  query GetListPost($limit: Int!, $skip: Int!) {
    allMarkdownRemark(sort: { fields: frontmatter___createAt, order: DESC }, limit: $limit, skip: $skip) {
      nodes {
        excerpt
        fields {
          path
        }
        frontmatter {
          title
          archives
          createAt(formatString: "yyyy-MM-DD")
          desc
          tags
        }
      }
    }
  }
`;

export default function PostList({ data, pageContext }: PageData) {
  return (
    <div>
      <nav>
        <Pagination currentPage={pageContext.currentPage} total={pageContext.numPages} />
      </nav>
      <ul>
        {data.allMarkdownRemark.nodes.map((v) => (
          <li key={v.fields.path}>
            <h2>
              <Link to={v.fields.path}> {v.frontmatter.title}</Link>
            </h2>
            <p>{v.frontmatter.desc || v.excerpt}</p>
            <p>{v.frontmatter.createAt}</p>

            {v.frontmatter.tags?.length > 0 && (
              <dl>
                <dt>标签</dt>
                {v.frontmatter.tags.map((v) => (
                  <dd key={v}>{v}</dd>
                ))}
              </dl>
            )}
            {v.frontmatter.archives?.length > 0 && (
              <dl>
                <dt>归档</dt>
                {v.frontmatter.archives.map((v) => (
                  <dd key={v}>{v}</dd>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </div>
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
        desc?: string;
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
