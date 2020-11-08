import React from "react"
import { Link,useStaticQuery,graphql } from "gatsby"
import {Query} from "../gen/graphql-types"
import styled from "styled-components"

const NavigationWrapper = styled.div`
  position: fixed;
  top: 200px;
  display: flex;
  flex-direction: column;
`
export default function Navigation() {
  return (
    <div style={{ position: "relative" }}>
      <NavigationWrapper>
        <Link to={"#hi!"}>Top</Link>
        <Link to={"#test-2"}>Top</Link>
        <Link to={"#test-3"}>Top</Link>
        <Link to={"#test-4"}>Top</Link>
        <Link to={"#test-5"}>Top</Link>
        <Link to={"#test-6"}>Top</Link>
        <Link to={"#test-7"}>Top</Link>
        <Link to={"#test-8"}>Top</Link>
      </NavigationWrapper>
    </div>
  )
}
