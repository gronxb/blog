import React from "react"
import Layout from "../components/layout"
import { ITemplateProps } from "../interface"
import SEO from "../components/seo"
import Comment from "../components/comment"
import {renderAst} from "../lib/utils"

type IPostTemplateProps = ITemplateProps<{
  html: string
  title: string
  date: string
}>

const Post: React.FC<IPostTemplateProps> = React.memo(props => {
  return (
    
    <Layout small>
      <SEO
        title={props.pageContext.title}
        description={props.pageContext.html}
      />
      <div>
        {renderAst(props.pageContext.htmlAst)}
        
      </div>

      <Comment
        repo="gron1gh1/blog"
        title={props.pageContext.title}
        date={props.pageContext.date}
      />
    </Layout>
  )
})

export default Post
