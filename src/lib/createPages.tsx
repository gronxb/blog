import { CreatePagesArgs } from "gatsby"
import path from "path"
import { Query } from "../gen/graphql-types"
const kebabCase = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
export async function createPages({ actions, graphql }: CreatePagesArgs) {
  const { createPage } = actions

  const { data, errors } = await graphql<Query>(`
    {
      allMarkdownRemark {
        edges {
          node {
            html
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD HH:mm:ss")
            }
          }
        }
      }
    }
  `)

  if (errors) {
    throw errors
  }

  data?.allMarkdownRemark.edges.forEach(({ node }: any) => {
    createPage({
      path: kebabCase(node.frontmatter.title),
      context: {
        html: node.html,
        title: node.frontmatter.title,
        date: node.frontmatter.date,
      },
      component: path.resolve(__dirname, "../templates/post.tsx"),
    })
  })
}
