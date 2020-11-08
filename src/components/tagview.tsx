import React from "react"
import { Link } from "gatsby"
import { MarkdownRemarkGroupConnection } from "../gen/graphql-types"
import styled from "styled-components"
import { kebabCase } from "../lib/utils"
import { useDispatch } from "react-redux"
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
}: {
  group: MarkdownRemarkGroupConnection[]
  totalCount: number
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
              // Post => Header => Tag 이동 시 애니메이션 True issue 있음.
              group.some(({ fieldValue }) => {
                if (
                  `/${kebabCase(fieldValue)}` === decodeURI(location.pathname)
                ) {
                  dispatch(BlogActions.toggleAnimation(false)) // Tag에서 Tag 이동 시 애니메이션 False
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
