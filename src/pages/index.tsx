import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Query } from "../gen/graphql-types"

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" description="" lang="ko" />
      <ul>
        
      </ul>
    </Layout>
  )
}

export default IndexPage
