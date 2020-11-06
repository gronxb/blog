import React from "react"
import Layout from "../components/layout"
import { ITemplateProps } from "../interface"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostView from "../components/PostView"
import {PostList} from "../components/styled"

type IPostTemplateProps = ITemplateProps<{
  html: string
  title: string
  date: string
}>
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
const Post: React.FC<IPostTemplateProps> = React.memo(props => {
  const data = useStaticQuery<Query>(LatestPostListQuery)
  return (
    <Layout small>
      <SEO
        title={props.pageContext.title}
        description={props.pageContext.html}
      />

      <ul>
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
  )
})

export default Post
