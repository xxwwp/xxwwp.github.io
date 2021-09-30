const path = require("path");
const config = require("./gatsby/config").default;
const { fileCommitInfo } = require("./gatsby/git");
const mdMini = require("./gatsby/mdZip").mdMini;

// markdown 处理
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
      createNodeField({
        node,
        name: `path`,
        value: "/" + config.docsPath + node.frontmatter.slug,
      });
      createNodeField({
        node,
        name: `mini`,
        value: mdMini(node.rawMarkdownBody),
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

// 分页处理
const pagination = {
  async createPage({ graphql, actions, reporter }) {
    const { createPage } = actions;
    const result = await graphql(
      `
        query GetAllMD {
          allMarkdownRemark(
            sort: { fields: frontmatter___createAt, order: DESC }
            filter: { frontmatter: { slug: { ne: null }, title: { ne: null }, createAt: { ne: null } } }
          ) {
            nodes {
              id
            }
          }
        }
      `
    );
    if (result.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`);
      return;
    }
    // ...
    // Create blog-list pages
    const posts = result.data.allMarkdownRemark.nodes;
    const postsPerPage = 10;
    const numPages = Math.ceil(posts.length / postsPerPage);
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/post-list` : `/post-list/${i + 1}`,
        component: path.resolve("./src/templates/PostList.tsx"),
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage: i + 1,
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
  await pagination.createPage.apply(this, args);
};
