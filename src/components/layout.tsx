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
import { Provider } from "react-redux"
import { store } from "../state/reducer"
import styled from "styled-components"
import Navigation from "./navigation"

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  .main-wrapper {
    max-width: 960px;
    flex: 1;
    margin: 1.5rem;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    .main-wrapper {
      margin: 0 1rem 1rem 1rem;
    }
  }
`
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
        <Header siteTitle="Develop & Moment, Future" small={small} />
        <Content>
          <TagView
            group={data.allMarkdownRemark.group}
            totalCount={data.allMarkdownRemark.totalCount}
          ></TagView>
          <div className="main-wrapper">
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
          </div>
          <Navigation />
        </Content>
      </Provider>
    </>
  )
}

export default Layout
