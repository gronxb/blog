import React from "react"
import Layout from "../components/layout"
import { ITemplateProps } from "../interface"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"
import PostView from "../components/PostView"
import {PostList} from "../components/styled"
import {kebabCase} from "../lib/utils"

type IPostTemplateProps = ITemplateProps<{
  title: string
  tag: string
}>

/*
query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
 */
const LatestPostListWithTagQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
        sort: { order: DESC, fields: frontmatter___date }
        filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
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
  const data = useStaticQuery<Query>(LatestPostListWithTagQuery)
  return (
    <Layout small>
      <SEO
        title={props.pageContext.title}
        description={props.pageContext.tag}
      />

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
})

export default Post
