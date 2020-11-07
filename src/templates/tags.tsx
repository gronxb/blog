import React from "react"
import Layout from "../components/layout"
import { ITemplateProps } from "../interface"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query, MarkdownRemarkConnection } from "../gen/graphql-types"
import PostView from "../components/PostView"
import { PostList } from "../components/styled"
import { kebabCase } from "../lib/utils"

type ITagTemplateProps = ITemplateProps<{
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
const Post: React.FC<ITagTemplateProps> = React.memo(props => {
  const {edges} : MarkdownRemarkConnection = props.data as MarkdownRemarkConnection;
  return (
    <Layout small>
      <SEO title={props.pageContext.tag} description={props.pageContext.tag} />

      <ul>
        {edges.map(({ node } : any) => (
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

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
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
