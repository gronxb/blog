import { Link } from "gatsby"
import React from "react"
import PageTransition from "gatsby-plugin-page-transitions"

function Header({
  siteTitle,
  small = false,
}: {
  siteTitle: React.ReactNode
  small?: boolean
}) {
  const defaultStyle = {
    transition: "height 500ms",
    background: `dimgray`,
    marginBottom: `1.45rem`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    height: small === false ? "30vh" : "100px",
  }
  const transitionStyle = {
    entering: { height: small === false ? "100px" : "30vh" },
    entered: { height: small === false ? "100px" : "30vh" },
    exiting: { height: small === false ? "30vh" : "100px" },
  }
  return (
    <PageTransition
      defaultStyle={defaultStyle}
      transitionStyles={transitionStyle}
      transitionTime={500}
    >
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
    </PageTransition>
  )
}

export default Header
