const path = require("path");

exports.default = async function createPages({ graphql, actions, reporter }) {
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
