import rehypeReact from "rehype-react";
import React, { ComponentPropsWithoutRef } from "react";
import styled, { css } from "styled-components";
import H1_6 from "./H1_6";
import Blockquote from "../Blockquote";
import Anchor from "./Anchor";
import "katex/dist/katex.min.css";
import codeStyle from "./codeStyle";

const Article = styled("article")`
  ${({ theme: { colors: c } }) => css`
    line-height: 1.5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI Variable", "Segoe UI", system-ui, ui-sans-serif, Helvetica,
      Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    color: ${c.text.main};
    letter-spacing: 0.05ex;

    ${codeStyle}
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: bold;
      line-height: 1.2;
      a {
        color: ${c.text.main};
      }
      a:hover,
      a:active,
      a:visited {
        text-shadow: 0px 0px 2px ${c.text.refer};
        &::after {
          content: " #";
          font-size: 1.8ex;
        }
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
      font-size: 1.65rem;
    }
    h2 {
      font-size: 1.5rem;
    }
    h3 {
      font-size: 1.35rem;
    }
    h4 {
      font-size: 1.2rem;
    }
    h5 {
      font-size: 1.05rem;
    }
    h6 {
      font-size: 0.95rem;
    }
    p {
      font-weight: 400;
      font-size: 0.95rem;
    }
    em,
    strong {
      background: ${(p) => p.theme.colors.bg.refer};
      padding: 0 1ex;
    }
    strong {
      font-size: 0.95rem;
    }

    pre[class*="language-"] {
      padding: 1em 1em;
      margin: 1em 0;
    }

    code:not([class*="language-"]) {
      background-color: ${(p) => p.theme.colors.bg.refer};
      color: ${(p) => p.theme.colors.secondary.main};
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      padding: 0 0.5ex;
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

    img {
      box-shadow: 0 0 10px 3px rgba(222, 226, 230, 0.548);
      border-radius: 5px;
    }
    a {
      color: ${c.link.main};
      text-decoration: none;
    }
    a:hover,
    a:active {
      filter: brightness(1.3);
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
  `}
`;

// 自定义 md 组件
const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    ...H1_6,
    blockquote: Blockquote,
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
      <Article {...rest}>
        <h1>{heading}</h1>
        <hr />
        {renderAst(htmlAst)}
      </Article>
    </React.Fragment>
  );
}
