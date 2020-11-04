/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import PageTransition from "gatsby-plugin-page-transitions"
import Header from "./header"
import "./layout.css"

const Layout = ({
  children,
  small = false,
}: {
  children: React.ReactNode
  small?: boolean
}) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle="Develop & Moment, Future" small={small}/>

      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
      </div>
    </>
  )
}

export default Layout
