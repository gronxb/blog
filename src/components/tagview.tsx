import React, { useEffect } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { MarkdownRemarkGroupConnection } from "../gen/graphql-types"
import styled from "styled-components"
import { kebabCase } from "../lib/utils"
import { useDispatch,useSelector } from "react-redux"
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
}: {
  group: MarkdownRemarkGroupConnection[]
}) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (location.pathname === "/") dispatch(BlogActions.toggleAnimation(false))
    else dispatch(BlogActions.toggleAnimation(true))

  
  }, [])
  return (
    <TagWrapper>
      Tags
      <hr />
      {group.map(({ fieldValue, totalCount }) => (
        <TagItem key={fieldValue}>
          <Link
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
