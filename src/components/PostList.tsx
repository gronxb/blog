import React from "react"
import { Link } from "gatsby"
import { kebabCase } from "../lib/utils"
import { useDispatch } from "react-redux"
import { BlogActions } from "../state/reducer"
import { MarkdownRemarkEdge } from "../gen/graphql-types"

interface IPostView {
  to: string
  src: string
  title: string
  date: string
  tags: string[]
  description: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}
export function PostView({
  to,
  src,
  title,
  date,
  tags,
  description,
  onClick,
}: IPostView) {
  return (
    <Link to={to} style={{ textDecoration: "none" }} onClick={onClick}>
      <div className="post-card">
        <img src={src} />
        <div className="bg-bar" />
        <div className="info">
          <h1>{title}</h1>
          <p>{tags.map(tag => `#${tag}`).join(" ")}</p>
          <p>{date}</p>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  )
}
export default function PostList(edges: MarkdownRemarkEdge[]) {
  const dispatch = useDispatch()
  return edges.map(({ node }: any) => (
    <li style={{ listStyleType: "none", marginBottom: "30px" }} key={node.id}>
      <PostView
        to={`/${kebabCase(node.frontmatter.title)}`}
        src={node.frontmatter.thumb.childImageSharp.fluid.src}
        title={node.frontmatter.title}
        date={node.frontmatter.date}
        tags={node.frontmatter.tags}
        description={node.excerpt}
        onClick={() => {
          dispatch(BlogActions.toggleAnimation(true))
        }}
      />
    </li>
  ))
}
