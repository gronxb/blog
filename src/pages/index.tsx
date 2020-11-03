import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostView from "../components/PostView"
import styled from "styled-components"
import PageTransition from "gatsby-plugin-page-transitions"

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
`
const IndexPage = () => {
  const data = useStaticQuery<Query>(LatestPostListQuery)
  return (
    <PageTransition
      defaultStyle={{
        transition: "1s",
        height: "30vh",
      }}
      transitionStyles={{
        entering: { height: "100px" },
        entered: { height: "100px" },
        exiting: { height: "30vh" },
      }}
      transitionTime={500}
    >
      <Layout>
        <SEO title="Home" />

        <ul>
          {console.log(data.allMarkdownRemark.edges)}
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <PostList key={node.id}>
              <PostView
                to={`/${node.frontmatter.title}`}
                src={node.frontmatter.thumb.childImageSharp.fluid.src}
                title={node.frontmatter.title}
                date={node.frontmatter.date}
                description={node.excerpt}
              />
            </PostList>
          ))}
        </ul>
      </Layout>
    </PageTransition>
  )
}

export default IndexPage
