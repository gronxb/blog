import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { MarkdownRemarkGroupConnection } from "../gen/graphql-types"
import { kebabCase } from "../lib/utils"
import { useDispatch } from "react-redux"
import { BlogActions } from "../state/reducer"
import classNames from "classnames"

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
    SetAnimation(
      // 미리 계산
      groupAll.some(({ fieldValue, path }) => {
        if (
          `/${kebabCase(path === "" ? "" : fieldValue)}` ===
          decodeURI(window.location.pathname)
        ) {
          return true // Tag에서 Tag 이동 시 애니메이션 False
        }
      })
    )
  }, [])
  return (
    <nav className="tag-wrapper">
      <hr />

      {groupAll.map(({ fieldValue, totalCount, path }) => (
        <li
          className={classNames(
            "tag-item",
            typeof window !== "undefined" &&
              `/${kebabCase(path === "" ? "" : fieldValue)}` ===
                decodeURI(window.location.pathname)
              ? "currPage"
              : ""
          )}
          key={fieldValue}
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
        </li>
      ))}
    </nav>
  )
}
