// 该文件编写了一些对 markdown 进行压缩的代码
const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkGfm = require("remark-gfm");
const toHast = require("mdast-util-to-hast");

const filterEls = ["pre", "svg", "style", "script", "blockquote"].reduce((prev, key) => {
  prev[key] = true;
  return prev;
}, {});

/**
 * 把 htmlAst 树转化为压缩字符串
 * 参见 https://github.com/syntax-tree/hast
 * @param hast htmlAst 树
 * @returns 返回一个压缩后的字符串
 */
function hastToString(hast) {
  if (!Array.isArray(hast)) {
    throw new Error(`hast 应该是一个数组，得到一个 ${typeof hast}`);
  }

  let str = "";

  hast.forEach((v) => {
    if (filterEls[v.tagName]) return;
    str += Array.isArray(v.children) ? hastToString(v.children) : v.value;
  });

  str += " ";

  return str.replace(/\s+/g, " ").replace(/(\$\$).*(\1)/g, "");
}

exports.mdMini = function mdMini(rawHtml) {
  const hast = toHast(unified().use(remarkParse).use(remarkGfm).parse(rawHtml));

  return hastToString([hast]);
};
