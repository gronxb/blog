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

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  .main-wrapper {
    maxwidth: 960px;
    flex: 1;
    margin: 1.5rem;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    .main-wrapper {
      margin: 1.5rem;
      margin-top: 0px;
    }
    nav {
      display: flex;
      overflow: scroll;
      width: 100%;
      padding: 0.75rem;
    }
    nav:before {
      content: none;
    }
    nav li {
      display: flex;
      margin-left: 10px;
      margin-right: 10px;
      padding: 0.75rem;
      font-size: 0.75rem;
      line-height: 0.75rem;
      align-items: center;
      flex-shrink: 0;
      height: 1rem;
      border-radius: 5px;
      background: dimgray;
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
        </Content>
      </Provider>
    </>
  )
}

export default Layout
