import React from "react"
import Layout from "./layout"
import { ITemplateProps } from "../interface"

type IPostTemplateProps = ITemplateProps<{
  html: string
  title: string
}>

const Post: React.FC<IPostTemplateProps> = React.memo(props => {
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: props.pageContext.html }}></div>
    </Layout>
  )
})

export default Post
