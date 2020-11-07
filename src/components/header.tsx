import { Link } from "gatsby"
import React from "react"
import PageTransition from "gatsby-plugin-page-transitions"
function HeaderContent({ siteTitle }: { siteTitle: React.ReactNode }) {
  return (
    <header>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
      </div>
    </header>
  )
}
function Header({
  siteTitle,
  small = false,
  animation = true,
}: {
  siteTitle: React.ReactNode
  small?: boolean
  animation?: boolean
}) {
  const defaultStyle = {
    transition: animation ? `height 350ms` : `none`,
    background: `dimgray`,
    marginBottom: `1.45rem`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    height: small === false ? `100px` : `30vh`,
  }
  const transitionStyle = {
    entering: { height: small === false ? "30vh" : "100px" },
    entered: { height: small === false ? "30vh" : "100px" },
    exiting: { height: small === false ? "100px" : "30vh" },
  }
  return (
    <PageTransition
      defaultStyle={defaultStyle}
      transitionStyles={transitionStyle}
    >
      <HeaderContent siteTitle={siteTitle} />
    </PageTransition>
  )
}

export default Header
