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
      }
    }
  `)
  const { data: tagData, errors: tagErrors } = await graphql<Query>(`
    {
      allMarkdownRemark {
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
  if (tagErrors) {
    throw tagErrors
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
  }

  if (tagData) {
    tagData.allMarkdownRemark.group.forEach((tags) => {
      // 여기부터
      createPage({
        path: tags.fieldValue,
        context: {
          tag: tags.fieldValue,
        },
        component: path.resolve(__dirname, "../templates/tags.tsx"),
      })
    })
  }
}
