import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostList from "../components/PostList"
import styled from "styled-components"
import { AiFillGithub, AiFillInstagram } from "react-icons/ai"
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

const ProfileBox = styled.div`
  flex: 1;
  border-radius: 10px;
  margin-top: 30px;
  padding-bottom: 2rem;
  height: 200px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    height: 100%;
  }
`

const ProfileImg = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 70%;
  overflow: hidden;
  flex: none;
  margin-left: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`

const ProfileContent = styled.div`
  margin-left: 30px;
  .name {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 15px;
    display: flex;

    div {
      margin-top: -2px;
      margin-left: 5px;
    }
  }
  .link{
    margin-top: 0.7rem;
  }
  .icon {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    font-weight: bold;
    a{
      text-decoration: none;
      &:link, &:visited{
        color:black;
      }
    }  
  }
  
  @media (max-width: 768px) {
    margin-top: 20px;
    align-items: center;
    display: flex;
    flex-direction: column;
    .icon {
      justify-content: center;
    }
  }
  @media (max-width: 440px) {
    .content {
      font-size: 80%;
    }
  }
`

const Profile = () => {
  return (
    <ProfileBox>
      <ProfileImg>
        <img src="https://avatars2.githubusercontent.com/u/41789633?s=460&u=78fa3dc9f8cabfc341f994074aac031e249e1ae3&v=4" />
      </ProfileImg>
      <ProfileContent>
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
              <a href="https://github.com/gron1gh1">github.com/gron1gh1</a>
            </div>
            <div className="icon">
              <HiOutlineMail
                size={20}
                style={{ marginTop: "3px", marginRight: "5px" }}
              />
              <a href="mailto:gron1gh1@gmail.com">gron1gh1@gmail.com</a>
            </div>
          </div>
        </div>
      </ProfileContent>
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
      <hr />
      <IndexView />
    </Layout>
  )
}

export default IndexPage
