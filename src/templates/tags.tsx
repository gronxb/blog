import React from "react"
import Layout from "../components/layout"
import { ITemplateProps } from "../interface"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import {
  Query,
  MarkdownRemarkConnection,
  MarkdownRemarkEdge,
} from "../gen/graphql-types"
import PostList from "../components/PostList"
type ITagTemplateProps = ITemplateProps<{
  tag: string
}>
const TagsView = ({ edges }: { edges: MarkdownRemarkEdge[] }) => {
  return <ul>{PostList(edges)}</ul>
}
const Tags: React.FC<ITagTemplateProps> = React.memo(props => {
  const {
    edges,
  }: MarkdownRemarkConnection = (props.data as Query).allMarkdownRemark

  return (
    <Layout>
      <SEO title={props.pageContext.tag} description={props.pageContext.tag} />
      <TagsView edges={edges} />
    </Layout>
  )
})

export default Tags

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
