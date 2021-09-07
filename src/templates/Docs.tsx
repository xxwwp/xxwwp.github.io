import { graphql } from "gatsby";
import MarkdownPage from "../components/Markdown";

function Docs({ data }) {
  return <MarkdownPage data={data} />;
}

export const query = graphql`
  query ($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
      }
      headings {
        depth
        value
      }
    }
  }
`;

export default Docs;
