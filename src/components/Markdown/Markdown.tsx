import rehypeReact from "rehype-react";
import { Helmet } from "react-helmet";
import React, { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";
import H1_6 from "./H1_6";
import Blockquote from "../Blockquote";
import Anchor from "./Anchor";
import "katex/dist/katex.min.css";

const MDBlockquote = (props) => <Blockquote {...props} bgColor="#eef" baseColor="#ccd" />;

const Article = styled("article")`
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI Variable", "Segoe UI", system-ui, ui-sans-serif, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #0f0f36;

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
      color: #383980;
      text-decoration: none;
      &::after {
        content: " #";
        font-size: 1.8ex;
      }
    }
    a::after {
      content: none;
    }
    &::before {
      content: "";
      display: block;
      pointer-events: none;
      padding-top: 80px;
      margin-top: -80px;
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
    background-color: #ecfbfd;
    color: #000;
  }
  blockquote {
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
  pre {
    border-radius: 5px;
    filter: hue-rotate(200deg);
  }
  code {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 87.5%;
  }
  img {
    box-shadow: 0 0 10px 3px rgba(222, 226, 230, 0.548);
    border-radius: 5px;
  }
  a {
    color: #0d6efd;
    text-decoration: none;
  }
  a:hover,
  a:visited,
  a:active {
    filter: brightness(1.5);
    text-decoration: underline;
  }

  table {
    border-collapse: collapse;
  }
  th {
    white-space: nowrap;
  }

  .gatsby-highlight,
  .math {
    margin: 1em 0;
  }
`;

// 自定义 md 组件
const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    ...H1_6,
    blockquote: MDBlockquote,
    a: Anchor,
  },
}).Compiler;

interface MarkdownProps extends ComponentPropsWithoutRef<"article"> {
  heading?: string;
  htmlAst?: object;
}

export default function Markdown({ heading, htmlAst, ...rest }: MarkdownProps) {
  return (
    <React.Fragment>
      <Helmet>
        <link
          key="prismTheme"
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/prismjs@1.23.0/themes/prism.css"
        ></link>
      </Helmet>
      <Article {...rest}>
        <h1>{heading}</h1>
        <hr />
        {renderAst(htmlAst)}
      </Article>
    </React.Fragment>
  );
}
