import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostView from "../components/PostView"
import styled from "styled-components"


const LatestPostListQuery = graphql`
  query LatestPostListQuery {
    allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
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
const PostList = styled.li`
  list-style-type: none;
  margin-bottom: 30px;
`;
const IndexPage = () => {
  const data = useStaticQuery<Query>(LatestPostListQuery)
  return (
    <Layout>
      <SEO title="Home" />
      
      <ul>
        {console.log(data.allMarkdownRemark.edges)}
        {data.allMarkdownRemark.edges.map(({ node }) => (
          
          <PostList key={node.id}>
            <PostView to={`/${node.frontmatter.title}`} src={node.frontmatter.thumb.childImageSharp.fluid.src} title={node.frontmatter.title} date={node.frontmatter.date}description={node.excerpt} />

          </PostList>
        ))}
      </ul>
    </Layout>
  )
}

export default IndexPage
