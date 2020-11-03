import { Link } from "gatsby"
import React from "react"

function Header({
  siteTitle,
}: {
  siteTitle: React.ReactNode
}) {

  return (
    <header
      style={{
        background: `dimgray`,
        marginBottom: `1.45rem`,
        height: `30vh`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        transition: `1s`
      }}
    >
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

export default Header
