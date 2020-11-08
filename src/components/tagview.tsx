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
  &:before {
    content: "Tags";
  }
  @media (max-width: 768px) {
    & {
      display: flex;
      overflow: scroll;
      width: 100%;
      padding: 0.5rem 1rem 0.5rem 0.7rem;
    }
    &:before {
      content: none;
    }
  }
`

const TagItem = styled.li<{ currPage?: boolean }>`
  font-size: 14px;
  list-style: none;
  a:link,
  a:visited {
    color: black;
  }
  a:hover {
    text-decoration: underline !important;
  }

  @media (max-width: 768px) {
    & {
      display: flex;
      margin: 5px;
      padding: 0.75rem;
      font-size: 0.75rem;
      line-height: 0.75rem;
      align-items: center;
      flex-shrink: 0;
      height: 1rem;
      border-radius: 10px;
      background: Gainsboro;
    }
    a:link,
    a:visited {
      color: black;
    }
    a:hover {
      text-decoration: none;
    }
    ${props =>
      props.currPage &&
      `
    &{
      a:link,
      a:visited {
        color: white;
      }
      background: CornflowerBlue;
    }
    `};
  }
`
interface IGroup {
  fieldValue: string
  totalCount: number
  path?: string
}

export default function TagView({
  group,
  totalCount,
}: {
  group: MarkdownRemarkGroupConnection[]
  totalCount: number
}) {
  const dispatch = useDispatch()

  const groupAll: IGroup[] = [
    {
      fieldValue: "All-Post",
      totalCount: totalCount,
      path: ""
    },
    ...(group as IGroup[]),
  ] // 기존 Tag에 All-Post 추가

  return (
    <TagWrapper>
      <hr />

      {groupAll.map(({ fieldValue, totalCount,path }) => (
        <TagItem key={fieldValue} currPage={
          `/${kebabCase(path === "" ? "" : fieldValue)}` === decodeURI(location.pathname) ? true : false
        }>
          <Link
            onClick={() => {
              // Post => Header(All Post) => Tag 이동 시 애니메이션 True issue 있음.
              group.some(({ fieldValue }) => {
                if (
                  `/${kebabCase(path === "" ? "" : fieldValue)}` === decodeURI(location.pathname)
                ) {
                  dispatch(BlogActions.toggleAnimation(false)) // Tag에서 Tag 이동 시 애니메이션 False
                  return true
                }
              })
            }}
            to={`/${kebabCase(path === "" ? "" : fieldValue)}`}
            style={{ textDecoration: "none" }}
          >
            {fieldValue} ({totalCount})
          </Link>
        </TagItem>
      ))}
    </TagWrapper>
  )
}
