import React, { useEffect, useRef } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import {
  MarkdownRemark,
  MarkdownRemarkEdge,
  MarkdownRemarkFrontmatter,
  MarkdownRemarkGroupConnection,
} from "../gen/graphql-types"
import styled from "styled-components"
import { kebabCase } from "../lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { BlogActions } from "../state/reducer"

const TagWrapper = styled.nav`
  padding: 1.5rem;
  width: 250px;
  margin-right: 50px;
`
const TagItem = styled.li`
  font-size: 14px;
  list-style: none;
  a:link {
    color: black;
  }
  a:hover {
    text-decoration: underline !important;
  }
  a:visited {
    color: black;
  }
`

export default function TagView({
  group,
  totalCount,
  nodes,
}: {
  group: MarkdownRemarkGroupConnection[]
  totalCount: number
  nodes: MarkdownRemark[]
}) {
  const dispatch = useDispatch()

  return (
    <TagWrapper>
      Tags
      <hr />
      <TagItem key={"All-Post"}>
        <Link
          onClick={() => {
            group.some(({ fieldValue }) => {
              if (
                `/${kebabCase(fieldValue)}` === decodeURI(location.pathname)
              ) {
                dispatch(BlogActions.toggleAnimation(false))
                return true
              }
            })
          }}
          to={`/`}
          style={{ textDecoration: "none" }}
        >
          All Post ({totalCount})
        </Link>
      </TagItem>
      {group.map(({ fieldValue, totalCount }) => (
        <TagItem key={fieldValue}>
          <Link
            onClick={() => {
              group.some(({ fieldValue }) => {
                console.log(
                  `/${kebabCase(fieldValue)}`,
                  decodeURI(location.pathname)
                )
                if (
                  `/${kebabCase(fieldValue)}` === decodeURI(location.pathname)
                ) {
                  dispatch(BlogActions.toggleAnimation(false))
                  return true
                }
              })
            }}
            to={`/${kebabCase(fieldValue)}`}
            style={{ textDecoration: "none" }}
          >
            {fieldValue} ({totalCount})
          </Link>
        </TagItem>
      ))}
    </TagWrapper>
  )
}
