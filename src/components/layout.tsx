/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Query } from "../gen/graphql-types"
import PageTransition from "gatsby-plugin-page-transitions"
import Header from "./header"
import TagView from "./tagview"
import "./layout.css"

const Layout = ({
  children,
  small = false,
}: {
  children: React.ReactNode
  small?: boolean
}) => {
  const data = useStaticQuery<Query>(graphql`
    query {
      allMarkdownRemark {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle="Develop & Moment, Future" small={small} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent:"center",
        }}
      >
        <TagView group={data.allMarkdownRemark.group}></TagView>
        <div
          style={{
            maxWidth: 960,
            flex: 1,
          }}
        >
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
        </div>
      </div>
    </>
  )
}

export default Layout
