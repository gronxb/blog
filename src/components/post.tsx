import React from "react"
import Layout from "./layout"
import { ITemplateProps } from "../interface"
import SEO from "./seo"
import Comment from "./comment"

type IPostTemplateProps = ITemplateProps<{
  html: string
  title: string
}>

const Post: React.FC<IPostTemplateProps> = React.memo(props => {
  return (
    <Layout>
      <SEO title={props.pageContext.title} description={props.pageContext.html} />
      <div dangerouslySetInnerHTML={{ __html: props.pageContext.html }}></div>
      <Comment repo="gron1gh1/blog-comment" title={props.pageContext.title}/>
    </Layout>
  )
})

export default Post
