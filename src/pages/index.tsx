import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostView from "../components/PostView"
import {PostList} from "../components/styled"
import {kebabCase} from "../lib/utils"

const LatestPostListQuery = graphql`
query LatestPostListQuery {
  allMarkdownRemark(sort: {order: DESC, fields: frontmatter___date}) {
    edges {
      node {
        excerpt(truncate: true, pruneLength: 200)
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD HH:mm:ss")
          thumb {
            childImageSharp {
              fluid(maxWidth: 700, maxHeight: 300) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        id
      }
    }
  }
}
`
const IndexPage = () => {
  const data = useStaticQuery<Query>(LatestPostListQuery)
  return (
    <Layout>
      <SEO title="Home" description="Home"/>

      <ul>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <PostList key={node.id}>
            <PostView
              to={`/${kebabCase(node.frontmatter.title)}`}
              src={node.frontmatter.thumb.childImageSharp.fluid.src}
              title={node.frontmatter.title}
              date={node.frontmatter.date}
              description={node.excerpt}
            />
          </PostList>
        ))}
      </ul>
    </Layout>
  )
}

export default IndexPage
