import { CreatePagesArgs } from "gatsby"
import path from "path"
import { Query } from "../gen/graphql-types"
import { kebabCase } from "./utils"
export async function createPages({ actions, graphql }: CreatePagesArgs) {
  const { createPage } = actions

  const { data, errors } = await graphql<Query>(`
    {
      allMarkdownRemark {
        edges {
          node {
            html
            htmlAst
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD HH:mm:ss")
            }
          }
        }
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  if (errors) {
    throw errors
  }

  if (data) {
    data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: kebabCase(node.frontmatter && node.frontmatter.title),
        context: {
          html: node.html,
          title: node.frontmatter ? node.frontmatter.title : "",
          date: node.frontmatter ? node.frontmatter.date : "",
        },
        component: path.resolve(__dirname, "../templates/post.tsx"),
      })
    })
    data.allMarkdownRemark.group.forEach(({ fieldValue, totalCount }) => {
      console.log("create tags ", `/${kebabCase(fieldValue)}`)
      createPage({
        path: kebabCase(fieldValue),
        context: {
          tag: fieldValue,
        },
        component: path.resolve(__dirname, "../templates/tags.tsx"),
      })
    })
  }
}
