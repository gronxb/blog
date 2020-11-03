module.exports = {
  siteMetadata: {
    title: `Develment Develog`,
    description: `Develment Develog`,
    author: `@gron1gh1`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-generate-typings`,
      options: {
              dest: `./src/gen/graphql-types.d.ts`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
          name: 'posts',
          path: `${__dirname}/posts`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
