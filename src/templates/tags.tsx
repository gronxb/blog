import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import { ITemplateProps } from "../interface"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query, MarkdownRemarkConnection } from "../gen/graphql-types"
import PostView from "../components/PostView"
import { PostList } from "../components/styled"
import { kebabCase } from "../lib/utils"
import { Provider, useDispatch } from "react-redux"
import { BlogActions, store } from "../state/reducer"
type ITagTemplateProps = ITemplateProps<{
  tag: string
}>

const Tags: React.FC<ITagTemplateProps> = React.memo(props => {
  const {
    edges,
  }: MarkdownRemarkConnection = (props.data as Query).allMarkdownRemark

  const dispatch = useDispatch()

  return (
    <Layout>
      <SEO title={props.pageContext.tag} description={props.pageContext.tag} />

      <ul>
        {edges.map(({ node }: any) => (
          <PostList key={node.id}>
            <PostView
              to={`/${kebabCase(node.frontmatter.title)}`}
              src={node.frontmatter.thumb.childImageSharp.fluid.src}
              title={node.frontmatter.title}
              date={node.frontmatter.date}
              description={node.excerpt}
              onClick={() => {
                dispatch(BlogActions.toggleAnimation(true))
              }}
            />
          </PostList>
        ))}
      </ul>
    </Layout>
  )
})

const TagWrapper: React.FC<ITagTemplateProps> = React.memo(props => {
  return (
    <Provider store={store}>
      <Tags {...props} />
    </Provider>
  )
})

export default TagWrapper

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
