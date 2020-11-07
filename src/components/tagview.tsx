import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { MarkdownRemarkGroupConnection } from "../gen/graphql-types"
import styled from "styled-components"

const TagWrapper = styled.nav`
padding: 1.5rem;
width:250px;
margin-right:50px;
`
const TagUl = styled.ul`
   
`;
const TagItem = styled.li`
font-size: 14px;
`
export default function TagView({
  group,
}: {
  group: MarkdownRemarkGroupConnection[]
}) {
  return (
    <TagWrapper>
       Tags
      <hr />
      <TagUl>
        {group.map(({ fieldValue, totalCount }) => (
          <TagItem key={fieldValue}>
            {fieldValue} ({totalCount})
          </TagItem>
        ))}
         {group.map(({ fieldValue, totalCount }) => (
          <TagItem key={fieldValue}>
            {fieldValue} ({totalCount})
          </TagItem>
        ))}
         {group.map(({ fieldValue, totalCount }) => (
          <TagItem key={fieldValue}>
            {fieldValue} ({totalCount})
          </TagItem>
        ))}
      </TagUl>
    </TagWrapper>
  )
}
