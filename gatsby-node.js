const path = require("path");
const config = require("./gatsby/config").default;
const { fileCommitInfo } = require("./gatsby/git");

const md = {
  /**
   * 创建 md 节点时，插入每个文件的 git 提交历史
   */
  onCreateNode: async function ({ node, getNode, actions }) {
    const { createNodeField } = actions;
    if (node.internal.type === `MarkdownRemark`) {
      const gitinfo = await fileCommitInfo(node.fileAbsolutePath);
      createNodeField({
        node,
        name: `gitinfo`,
        // 对象无法正常存储，只能使用 json 字符串
        value: JSON.stringify(gitinfo),
      });
    }
  },

  /**
   * 根据 docs 文件夹下的 md 文件创建页面
   */
  createPages: async function ({ graphql, actions, reporter }) {
    const { createPage } = actions;
    const result = await graphql(`
      query GetMarkdowns {
        allMarkdownRemark {
          nodes {
            frontmatter {
              slug
            }
          }
        }
      }
    `);

    result.data.allMarkdownRemark.nodes.forEach((node) => {
      createPage({
        path: config.docsPath + node.frontmatter.slug,
        component: path.resolve(`./src/templates/Docs.tsx`),
        context: {
          slug: node.frontmatter.slug,
        },
      });
    });
  },
};

exports.onCreateNode = async (...args) => {
  await md.onCreateNode.apply(this, args);
};

exports.createPages = async (...args) => {
  await md.createPages.apply(this, args);
};
