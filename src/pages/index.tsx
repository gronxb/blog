import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import Img from "gatsby-image"
const LatestPostListQuery = graphql`
  query LatestPostListQuery {
    allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
      edges {
        node {
          excerpt(truncate: true, pruneLength: 200)
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD HH:mm:ss")
            thumb{
              childImageSharp {
                fixed(width: 125, height: 125) {
                  ...GatsbyImageSharpFixed
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
      <SEO title="Home"/>
      <ul>
        {console.log(data.allMarkdownRemark.edges)}
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <li key={node.id}>
            <Img
                  fixed={node.frontmatter.thumb.childImageSharp.fixed}
                />
            <h2>
              <Link to={`/${node.frontmatter.title}`}>{node.frontmatter.title}</Link>
            </h2>
            <h3>{node.frontmatter.date}</h3>
            <p>{node.excerpt}</p>
            <hr />
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default IndexPage
