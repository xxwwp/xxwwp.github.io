import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import { Helmet } from "react-helmet";
import React, { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";

const Article = styled("article")`
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI Variable", "Segoe UI", system-ui, ui-sans-serif, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #336;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: bold;
    line-height: 1.2;
    color: #212529;
    a,
    a:hover,
    a:active,
    a:visited {
      color: inherit;
    }
  }
  h1 {
    font-size: 1.75rem;
  }
  h2 {
    font-size: 1.6rem;
  }
  h3 {
    font-size: 1.45rem;
  }
  h4 {
    font-size: 1.3rem;
  }
  h5 {
    font-size: 1.15rem;
  }
  h6 {
    font-size: 1rem;
  }
  p {
    font-weight: 400;
    font-size: 1rem;
  }
  em {
    background-color: #fcf8e3;
    font-style: normal;
    color: #000;
  }
  blockquote {
    margin: 1.25rem -1rem;
    padding: 0.5rem 1.25rem;
    border: 1px solid #eee;
    border-left-width: 0.25rem;
    border-radius: 0.25rem;
    border-left-color: #f0ad4e;
    cite {
      text-align: right;
      color: silver;
      font-size: 1rem;
    }
  }
  ul,
  ol {
    padding-left: 2rem;
  }
  /* .remark-highlight {
    margin-left: -1rem;
    margin-right: -1rem;
  } */
  pre {
    border-radius: 5px;
    box-shadow: 0 0 10px 3px #cacaca;
  }
  code {
    color: #e83e8c;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 87.5%;
  }
  img {
    box-shadow: 0 0 10px 3px rgba(222, 226, 230, 0.548);
    border-radius: 5px;
  }
  a {
    color: #0d6efd;
  }
  a:hover {
    color: #488df5;
  }
  a:visited {
    color: #0a5dda;
  }
  a:active {
    color: #72a6f5;
    text-shadow: 0 0 3px #7e8af8;
  }
`;

interface MarkdownProps extends ComponentPropsWithoutRef<"article"> {
  heading?: string;
  body?: string;
}

export default function Markdown({ heading, body, ...rest }: MarkdownProps) {
  return (
    <React.Fragment>
      <Helmet>
        <link
          key="prismTheme"
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/prismjs@1.23.0/themes/prism-tomorrow.css"
        ></link>
      </Helmet>
      <Article {...rest}>
        <h1>{heading}</h1>
        <hr />
        <MDXProvider components={{}}>
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </Article>
    </React.Fragment>
  );
}
