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
  @media (max-width: 768px) {
    & {
      display: none;
  }
`
const NavItem = styled(Link)`
  white-space: pre;
  font-size: 14px;
  text-decoration: none;
  transition: 0.3s;

  &:hover{
    font-size: 15px;
    font-weight: bold;
  }
  &:link, &:visited {
    color: black;
  }

 
`;

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
        <hr style={{width:'5px', height:'100%', position: 'absolute'}} />
        {list.map(v => (
          <NavItem to={`#${kebabCase(v.value)}`}>{"\t".repeat(v.size)}{v.value}</NavItem>
        ))}
      </NavigationWrapper>
    </PageTransition>
  )
}
