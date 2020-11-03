import React from "react"
import Layout from "./layout"
import { ITemplateProps } from "../interface"
import SEO from "./seo"
import Comment from "./comment"
import "./post.css"
import PageTransition from 'gatsby-plugin-page-transitions';

type IPostTemplateProps = ITemplateProps<{
  html: string
  title: string
}>

const Post: React.FC<IPostTemplateProps> = React.memo(props => {
  return (
    <PageTransition>
      <Layout headerHeight="100px">
        <SEO
          title={props.pageContext.title}
          description={props.pageContext.html}
        />
        <div dangerouslySetInnerHTML={{ __html: props.pageContext.html }}></div>
        <Comment repo="gron1gh1/blog" title={props.pageContext.title} />
      </Layout>
    </PageTransition>
  )
})

export default Post
