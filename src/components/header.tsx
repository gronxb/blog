import { Link } from "gatsby"
import React, { useEffect } from "react"
import PageTransition from "gatsby-plugin-page-transitions"
import { Provider, useSelector } from "react-redux"
import { store } from "../state/reducer"

function Header({
  siteTitle,
  small = false,
}: {
  siteTitle: React.ReactNode
  small?: boolean
}) {
  const reduxAnimation: boolean = useSelector(
    ({ animation }: { animation: boolean }) => animation
  )
  console.log(reduxAnimation)
  useEffect(()=>{
    console.log("useEffect",reduxAnimation);
  })
  const defaultStyle = {
    transition: reduxAnimation ? `height 350ms` : `none`,
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
