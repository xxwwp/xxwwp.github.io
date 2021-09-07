const mdxRender = require("./gatsby/mdxRender");

// 把 mdx 文件数据使用指定模板渲染
exports.createPages = async (...args) => {
  await mdxRender.default.apply(this, args);
};
