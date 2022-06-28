import { css } from "styled-components";

const codeStyle = css`
  pre[class*="language-"] {
    overflow: auto;
    background: #fcfcfc;
  }
  pre[class*="language-"] > code[class*="language-"] {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 87.5%;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;

    color: #424242;
    background: inherit;
  }

  /* Inline code */
  :not(pre) > code[class*="language-"] {
    padding: 0.2em;
    border-radius: 0.3em;
    box-shadow: none;
    white-space: normal;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: ${(p) => p.theme.colors.green.refer};
  }

  .token.punctuation {
    color: #999;
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.class-name {
    color: ${(p) => p.theme.colors.link.main};
  }

  .token.selector,
  .token.string {
    color: ${(p) => p.theme.colors.yellow.main};
  }

  .token.attr-name,
  .token.char,
  .token.builtin {
    color: ${(p) => p.theme.colors.primary.main};
  }

  /* .token.operator, */
  .token.entity,
  .token.url,
  .language-css .token.string,
  .token.variable,
  .token.inserted {
    color: yellowgreen;
  }

  .token.attr-value {
    color: ${(p) => p.theme.colors.secondary.main};
  }

  .token.atrule,
  .token.keyword {
    color: ${(p) => p.theme.colors.secondary.main};
  }

  .token.regex,
  .token.important {
    color: orange;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.deleted {
    color: red;
  }

  .token.function {
    color: ${(p) => p.theme.colors.yellow.main};
  }
`;

export default codeStyle;
