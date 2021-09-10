import { graphql } from "gatsby";
import * as React from "react";

export const qeury = graphql`
  query {
    allMarkdownRemark {
      nodes {
        fields {
          path
        }
        frontmatter {
          archives
          createAt(formatString: "yyyy-MM-DD")
          desc
          publish
          tags
          title
        }
        excerpt
      }
    }
  }
`;

export default function Index({ data }) {
  console.log(data);
  return (
    <>
      <header>玄晓乌屋</header>
      <nav></nav>
    </>
  );
}
