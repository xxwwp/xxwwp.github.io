import { css } from "styled-components";

const codeStyle = css`
  pre[class*="language-"] {
    overflow: auto;
    background: #122;
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

    color: ${(p) => p.theme.colors.primary.main};
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
    color: #cfb500;
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.property {
    color: ${(p) => p.theme.colors.secondary.refer};
  }

  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.class-name {
    color: ${(p) => p.theme.colors.green.main};
  }

  .token.tag > .token.tag,
  .token.tag > .punctuation {
    color: ${(p) => p.theme.colors.link.refer};
  }

  .token.selector {
    color: ${(p) => p.theme.colors.yellow.refer};
  }

  .token.string {
    color: ${(p) => p.theme.colors.yellow.main};
  }

  .token.attr-name,
  .token.char,
  .token.builtin {
    color: ${(p) => p.theme.colors.primary.main};
  }

  .token.operator {
    color: #eee;
  }

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
    color: ${(p) => p.theme.colors.yellow.refer};
  }
`;

export default codeStyle;
