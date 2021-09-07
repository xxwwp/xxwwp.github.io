const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require("path");

// 把 mdx 文件加入 graphQL 数据
// exports.onCreateNode = ({ node, getNode, actions }) => {
//   const { createNodeField } = actions;

//   /** .mdx 类型文件的 mediaType 是 "text/mdx" */
//   if (node.internal.mediaType === "text/markdown") {
//     const slug = createFilePath({ node, getNode, basePath: `docs` });
//     createNodeField({
//       node,
//       name: `slug`,
//       value: slug,
//     });
//   }
// };

// 把 mdx 文件数据使用指定模板渲染
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMdx {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `);

  result.data.allMdx.nodes.forEach((node) => {
    createPage({
      path: "docs/" + node.frontmatter.slug,
      component: path.resolve(`./src/templates/Docs.tsx`),
      context: {
        slug: node.frontmatter.slug,
      },
    });
  });
};

// webpack 路径解析
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        docs: path.resolve(__dirname, "docs/"),
      },
    },
  });
};
