import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostList from "../components/PostList"
import styled from "styled-components"

const LatestPostListQuery = graphql`
  query LatestPostListQuery {
    allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
      edges {
        node {
          excerpt(truncate: true, pruneLength: 150)
          frontmatter {
            tags
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

const ProfileBox = styled.div`
  flex: 1;
  border-radius: 10px;
  margin-bottom: 1rem;
  height: 200px;
  background: rgb(34, 49, 63);
`;

const Profile = () => {
  return (
    <ProfileBox>
      
    </ProfileBox>
  )
}
const IndexView = () => {
  const data = useStaticQuery<Query>(LatestPostListQuery)
  return <ul>{PostList(data.allMarkdownRemark.edges)}</ul>
}
const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" description="Home" />
      <Profile />
      <IndexView />
    </Layout>
  )
}

export default IndexPage
