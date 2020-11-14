import React from "react"
import Layout from "../components/layout"
import { ITemplateProps } from "../interface"
import SEO from "../components/seo"
import Comment from "../components/comment"
import { renderAst } from "../lib/utils"
import { kebabCase } from "../lib/utils"
import Navigation from "../components/navigation"
import { graphql } from "gatsby"

type IPostTemplateProps = ITemplateProps<{
  html: string
  htmlAst: any
  title: string
  date: string
  tags: string[]
  thumb: any;
}>

const Post: React.FC<IPostTemplateProps> = React.memo(props => {
  props.pageContext.htmlAst.children = props.pageContext.htmlAst.children.map(
    item => {
      if (item.tagName && item.tagName.includes("h")) {
        item.properties = {
          id: kebabCase(item.children[0].value),
        }
      }
      return item
    }
  )

  const hList = props.pageContext.htmlAst.children
    .filter(item => item.tagName && item.tagName.includes("h"))
    .map(item => {
      return {
        value: item.children[0].value,
        size: parseInt(item.tagName.slice(1))
      }
    })
  return (
    <Layout small rightbar={<Navigation list={hList} />}>
      <SEO
        title={props.pageContext.title}
        description={props.pageContext.html}
      />
      <div style={{marginTop:"1.5rem",marginBottom:"1.5rem"}}>
      <h1>
        {props.pageContext.title}
      </h1>
      <p style={{fontSize:"0.8rem",textAlign:"end"}}>
        {props.pageContext.date}
      </p>
      <p style={{fontSize:"0.8rem",textAlign:"end"}}>
          {props.pageContext.tags?.map(tag => `#${tag}`).join(" ")}
      </p>
      
      <div>
        <img src={props.pageContext.thumb.childImageSharp.fluid.src} style={{marginTop:"1.5rem"}} />
        {renderAst(props.pageContext.htmlAst)}
      </div>
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
