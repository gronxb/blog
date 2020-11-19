import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostList from "../components/PostList"
import styled from "styled-components"
import { AiFillGithub } from "react-icons/ai"
import { HiOutlineMail } from "react-icons/hi"

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

const Profile = () => {
  return (
    <div className="profile-box">
      <div className="profile-img">
        <img src="https://avatars2.githubusercontent.com/u/41789633?s=460&u=78fa3dc9f8cabfc341f994074aac031e249e1ae3&v=4" />
      </div>
      <div className="profile-content">
        <p className="name">강선규</p>
        <div className="content">
          <p>이것저것 다하는 풀스택 지향 개발자입니다😉</p>
          <p>웹 어플리케이션 개발을 좋아합니다💕</p>
          <p>일상생활의 문제를 자동화하는 것을 좋아합니다✨</p>
          <div className="link">
            <div className="icon">
              <AiFillGithub
                size={20}
                style={{ marginRight: "5px" }}
              />
              <a target="_blank" href="https://github.com/gron1gh1">github.com/gron1gh1</a>
            </div>
            <div className="icon">
              <HiOutlineMail
                size={20}
                style={{ marginTop: "2px", marginRight: "5px" }}
              />
              <a href="mailto:gron1gh1@gmail.com">gron1gh1@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const IndexView = () => {
  const data = useStaticQuery<Query>(LatestPostListQuery)
  return <ul>{PostList(data.allMarkdownRemark.edges)}</ul>
}
const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" description="Develment IT Blog | 선규의 개발 블로그 !" />
      <Profile />
      <hr />
      <IndexView />
    </Layout>
  )
}

export default IndexPage
