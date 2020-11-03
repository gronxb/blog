import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import Img from "gatsby-image"
import styled from "styled-components"

const StyleImg = styled(Img)<{ fluid: { fluid: any } }>`
  cursor: pointer;
  transition: 0.3s;
  maxwidth: 700px;
  maxheight: 300px;
  filter: brightness(100%);
  &:hover {
    filter: brightness(70%);
  }
`
const Card = styled.div`
  width: 280px;
  height: 360px;
  border-radius: 15px;
  padding: 1.5rem;
  background: white;
  position: relative;
  display: flex;
  align-items: flex-end;
  transition: 0.4s ease-out;
  box-shadow: 0px 7px 10px rgba(black, 0.5);

  &:hover{
    transform: translateY(20px);
    &:before{
      opacity: 1;
    }
    .info{
      opacity: 1;
      
      transform: translateY(0px);
    }
  }
  
    
  &:before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background: rgba(black, 0.6);
    z-index: 2;
    transition: 0.5s;
    opacity: 0;
  }

  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 15px;
  }
  .info{
    position: relative;
    z-index: 3;
    color: white;
    opacity: 0;
    transform: translateY(30px);
    transition: 0.5s;
    h1{
      margin: 0px;
    }
    p{
      letter-spacing: 1px;
      font-size: 15px;
      margin-top: 8px;
    }
  }
`

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
/*


img(src="https://images.unsplash.com/photo-1477666250292-1419fac4c25c?auto=format&fit=crop&w=667&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D")
		.info
			h1 Mountain
			p Lorem Ipsum is simply dummy text from the printing and typeseting industry
			button Read More

 */
const IndexPage = () => {
  const data = useStaticQuery<Query>(LatestPostListQuery)
  return (
    <Layout>
      <SEO title="Home" />
      <Card>
        <img src="https://images.unsplash.com/photo-1477666250292-1419fac4c25c?auto=format&fit=crop&w=667&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D" />
        <div className="info">
          <h1>
            Mountain
          </h1>
          <p>
          Lorem Ipsum is simply dummy text from the printing and typeseting industry
          </p>
        </div>
      </Card>
      <ul>
        {console.log(data.allMarkdownRemark.edges)}
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <li key={node.id}>
            <StyleImg fluid={node.frontmatter.thumb.childImageSharp.fluid} />
            <h2>
              <Link to={`/${node.frontmatter.title}`}>
                {node.frontmatter.title}
              </Link>
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
