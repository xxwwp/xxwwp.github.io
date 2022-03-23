import rehypeReact from "rehype-react";
import React, { ComponentPropsWithoutRef } from "react";
import styled, { css } from "styled-components";
import H1_6 from "./H1_6";
import Blockquote from "../Blockquote";
import Anchor from "./Anchor";
import "katex/dist/katex.min.css";
import codeStyle from "./codeStyle";
import Table from "./Table";

function emUnit(px: number) {
  return (px / 16).toFixed(2) + "em";
}

const Article = styled("article")`
  font-size: 0.9rem;
  ${({ theme: { colors: c } }) => css`
    line-height: 1.7;
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
      margin-top: 1.6em;
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
        padding-top: ${emUnit(80)};
        margin-top: ${emUnit(-80)};
      }
    }
    h1 {
      font-size: ${emUnit(27)};
    }
    h2 {
      font-size: ${emUnit(25)};
    }
    h3 {
      font-size: ${emUnit(23)};
    }
    h4 {
      font-size: ${emUnit(21)};
    }
    h5 {
      font-size: ${emUnit(19)};
    }
    h6 {
      font-size: ${emUnit(17)};
    }
    p {
      font-weight: 400;
      font-size: ${emUnit(17)};
    }
    em,
    strong {
      background: ${c.bg.refer};
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
      background-color: ${c.bg.refer};
      color: ${c.secondary.main};
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      padding: 0 0.5ex;
    }

    blockquote {
      cite {
        text-align: right;
        color: silver;
        font-size: 1em;
      }
    }
    ul,
    ol {
      padding-left: 2em;
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

    .table-box {
      overflow-x: auto;
    }
    table {
      border-collapse: collapse;
    }
    th {
      white-space: nowrap;
      min-width: 100px;
    }

    th,
    td {
      padding: 10px;
    }
    th,
    td {
      border: 1px solid ${c.primary.refer};
    }
    th {
      text-align: left;
      border-bottom: 1px solid ${c.primary.main};
    }

    .gatsby-highlight,
    .math {
      margin: 1em 0;
    }

    iframe {
      box-shadow: 0px 2px 10px ${c.primary.refer};
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
    table: Table,
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
        <div className="renderAst">{renderAst(htmlAst)}</div>
      </Article>
    </React.Fragment>
  );
}
