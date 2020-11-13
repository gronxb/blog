import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostList from "../components/PostList"
import styled from "styled-components"
import {AiFillGithub} from "react-icons/ai"
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
  display: flex;
  align-items: center;
`;

const Profile = () => {
  return (
    <ProfileBox>
      <div style={{width:"150px",height:"150px",borderRadius:"70%",overflow:"hidden",flex:"none"}}>
      <img style={{width:"100%",height:"100%",objectFit:"cover"}} src="https://avatars2.githubusercontent.com/u/41789633?s=460&u=78fa3dc9f8cabfc341f994074aac031e249e1ae3&v=4"/>
      </div>
      <div>
        <div style={{fontSize:"1.5rem",fontWeight:"bold"}}>
          강선규
          <AiFillGithub/>
        </div>
        <div style={{fontWeight:"lighter"}}>
        <p>이것저것 다하는 풀스택 지향 개발자입니다😉</p>
        <p>웹 어플리케이션 개발을 좋아합니다💕</p>
        <p>일상생활의 문제를 자동화하거나 핵심이 되는 기능들을 자주 개발합니다✨</p>
        </div>
      </div>
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
