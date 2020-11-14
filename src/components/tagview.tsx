import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { MarkdownRemarkGroupConnection } from "../gen/graphql-types"
import styled from "styled-components"
import { kebabCase } from "../lib/utils"
import { useDispatch } from "react-redux"
import { BlogActions } from "../state/reducer"

const TagWrapper = styled.nav`
  padding: 1.5rem;
  padding-right: 0px;
  padding-left: 0px;
  width: 130px;
  &:before {
    content: "Tags";
  }
  @media (max-width: 768px) {
    & {
      display: flex;
      overflow-x: auto;
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
  ${props =>
    props.currPage &&
    `
  &{
    a:link,
    a:visited {
      color: CornflowerBlue;
    }
  }
  `}
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
      text-decoration: none !important;
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
    `}
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
      fieldValue: "All Post",
      totalCount: totalCount,
      path: "",
    },
    ...(group as IGroup[]),
  ] // 기존 Tag에 All Post 추가
  const [chooseAnimation, SetAnimation] = useState(false)
  useEffect(() => {
    SetAnimation( // 미리 계산
      groupAll.some(({ fieldValue, path }) => {
        if (
          `/${kebabCase(path === "" ? "" : fieldValue)}` ===
          decodeURI(location.pathname)
        ) {
          return true  // Tag에서 Tag 이동 시 애니메이션 False
        }
      })
    )
  }, [])
  return (
    <TagWrapper>
      <hr />

      {groupAll.map(({ fieldValue, totalCount, path }) => (
        <TagItem
          key={fieldValue}
          currPage={
            `/${kebabCase(path === "" ? "" : fieldValue)}` ===
            decodeURI(location.pathname)
              ? true
              : false
          }
        >
          <Link
            onClick={() => {
              if (chooseAnimation) dispatch(BlogActions.toggleAnimation(false))

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
