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
import { Provider } from "react-redux"
import { store } from "../state/reducer"

const Layout = ({
  children,
  small = false,
  rightbar
}: {
  children: React.ReactNode
  small?: boolean
  rightbar?: React.ReactNode
}) => {
  const data = useStaticQuery<Query>(graphql`
    query {
      allMarkdownRemark {
        totalCount
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  return (
    <>
      <Provider store={store}>
        <Header small={small} />
        <div className="layout-content">
          <TagView
            group={data.allMarkdownRemark.group}
            totalCount={data.allMarkdownRemark.totalCount}
          ></TagView>
          <div className="main-wrapper">
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
          </div>
          
          {rightbar}
        </div>
        
      </Provider>
    </>
  )
}

export default Layout
