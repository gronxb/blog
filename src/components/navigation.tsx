import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Query } from "../gen/graphql-types"
import styled from "styled-components"
import { kebabCase } from "../lib/utils"

import PageTransition from "gatsby-plugin-page-transitions"

const NavigationWrapper = styled.div`
  position: fixed;
  top: 200px;
  display: flex;
  flex-direction: column;
`
export default function Navigation({
  list,
}: {
  list: {
    value: string
    size: number
  }[]
}) {
  return (
    <PageTransition defalutStyle={{ position: "relative" }}>
      <NavigationWrapper>
        {list.map(v => (
          <Link style={{whiteSpace: "pre"}} to={`#${kebabCase(v.value)}`}>{"\t".repeat(v.size)}{v.value}</Link>
        ))}
      </NavigationWrapper>
    </PageTransition>
  )
}
