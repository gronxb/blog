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
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD HH:mm:ss")
            }
          }
        }
        group(field: frontmatter___tags) {
          tag: fieldValue
          totalCount
        }
      }
    }
  `)

  if (errors) {
    throw errors
  }

  if (data) {
    data.allMarkdownRemark.edges.forEach(({ node }: any) => {
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
    data.allMarkdownRemark.group.forEach(({tag,totalCount} : any) => {
      // 여기부터
      console.log("create tags ",`/${tag}`)
      createPage({
        path: "/" + tag,
        context: {
          tag,
        },
        component: path.resolve(__dirname, "../templates/tags.tsx"),
      })
    })
  }

}
