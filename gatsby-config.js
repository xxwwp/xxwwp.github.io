module.exports = {
  siteMetadata: {
    siteUrl: "https://xxwwp.github.io",
    title: "玄晓乌屋",
  },
  plugins: [
    "gatsby-plugin-emotion",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/docs/`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        remarkPlugins: [require("remark-prism")],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
            },
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,

    /** @refer https://www.gatsbyjs.com/plugins/gatsby-plugin-image */
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`, // Needed for dynamic images
  ],
};
