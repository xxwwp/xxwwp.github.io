const path = require("path");
const { fileCommitInfo } = require("./gatsby/git");
const mdMini = require("./gatsby/mdZip").mdMini;

// markdown 处理
const md = {
  /**
   * 创建 md 节点时，插入数据
   */
  onCreateNode: async function ({ node, getNode, actions }) {
    const { createNodeField } = actions;
    if (node.internal.type === `MarkdownRemark`) {
      // 每个文件的 git 提交历史
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
        value: node.frontmatter.slug,
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
              id
            }
            fileAbsolutePath
          }
        }
      }
    `);

    // id 检查
    const idMap = new Map();
    result.data.allMarkdownRemark.nodes.forEach((node) => {
      const { fileAbsolutePath } = node;
      const { id } = node.frontmatter;
      if (idMap.has(id))
        throw new Error(
          `id ${id} 重复：\n目标 fileAbsolutePath：${fileAbsolutePath}；\n当前 fileAbsolutePath：${idMap.get(id)}`
        );
      idMap.set(id, fileAbsolutePath);
    });

    result.data.allMarkdownRemark.nodes.forEach((node) => {
      createPage({
        path: node.frontmatter.slug,
        component: path.resolve(`./src/templates/Docs.tsx`),
        context: {
          slug: node.frontmatter.slug,
        },
      });
    });
  },
};

// markdown 文字卡片分页器
function mdPagination(gql, url, component, postsPerPage = 10) {
  return async function createPage({ graphql, actions, reporter }) {
    const { createPage } = actions;
    const result = await graphql(gql);
    if (result.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query. 创建 markdown 分页失败，路径 ${url}。`);
      return;
    }
    // Create blog-list pages
    const posts = result.data.allMarkdownRemark.nodes;
    const numPages = Math.ceil(posts.length / postsPerPage);
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `${url}` : `${url}/${i + 1}`,
        component,
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage: i + 1,
        },
      });
    });
  };
}

// 记录页
const recordPage = mdPagination(
  `
    query GetRecordPages{
      allMarkdownRemark(
        sort: { fields: frontmatter___createAt, order: DESC }
        filter: {
          frontmatter: { slug: { ne: null }, title: { ne: null }, createAt: { ne: null }, publish: { eq: true }, obsolete: { ne: true } }
        }
      ) {
        nodes {
          id
        }
      }
    }
  `,
  "/record",
  path.resolve("./src/templates/Record.tsx")
);

const DraftPage = mdPagination(
  `
    query GetDraftPage {
      allMarkdownRemark(
        sort: { fields: frontmatter___createAt, order: DESC }
        filter: {
          frontmatter: { slug: { ne: null }, title: { ne: null }, createAt: { ne: null }, publish: { ne: true }, obsolete: { ne: true } }
        }
      ) {
        nodes {
          id
        }
      }
    }
  `,
  "/draft",
  path.resolve("./src/templates/Draft.tsx")
);

exports.onCreateNode = async (...args) => {
  await md.onCreateNode.apply(this, args);
};

exports.createPages = async (...args) => {
  await md.createPages.apply(this, args);
  await recordPage.apply(this, args);
  await DraftPage.apply(this, args);
};
