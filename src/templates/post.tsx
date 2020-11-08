import React from "react"
import Layout from "../components/layout"
import { ITemplateProps } from "../interface"
import SEO from "../components/seo"
import Comment from "../components/comment"
import { renderAst } from "../lib/utils"
import { kebabCase } from "../lib/utils"

type IPostTemplateProps = ITemplateProps<{
  html: string
  htmlAst: any
  title: string
  date: string
}>

const Post: React.FC<IPostTemplateProps> = React.memo(props => {
  console.log(props.pageContext)

  props.pageContext.htmlAst.children = props.pageContext.htmlAst.children.map(
    item => {
      if (item.tagName === "h1") {
        item.properties = {
          id: kebabCase(item.children[0].value),
        }
      }
      return item
    }
  )

  return (
    <Layout small>
      <SEO
        title={props.pageContext.title}
        description={props.pageContext.html}
      />
      
      <div>{renderAst(props.pageContext.htmlAst)}</div>

      <Comment
        repo="gron1gh1/blog"
        title={props.pageContext.title}
        date={props.pageContext.date}
      />
    </Layout>
  )
})

export default Post
