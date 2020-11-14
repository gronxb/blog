import { Link } from "gatsby"
import React from "react"
import PageTransition from "gatsby-plugin-page-transitions"
import { useSelector } from "react-redux"

function Header({
  small = false,
}: {
  small?: boolean
}) {
  const reduxAnimation: boolean = useSelector(
    ({ animation }: { animation: boolean }) => animation
  )

  const defaultStyle = {
    transition: reduxAnimation ? `350ms` : `none`,
    background: `url(/static/logo.png)`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    height: small === false ? `100px` : `30vh`,
    backgroundRepeat: `no-repeat`,
    backgroundPosition: `center`,
    backgroundColor: `rgb(34,49,63)`,
    backgroundSize: `500px`
  }
  const transitionStyle = {
    entering: { height: small === false ? "30vh" : "100px",
    backgroundSize: small === false ? "500px" : " 200px"},
    entered: { height: small === false ? "30vh" : "100px",
    backgroundSize: small === false ? "500px" : " 200px" },
    exiting: { height: small === false ? "100px" : "30vh" ,
    backgroundSize: small === false ? "200px" : " 500px"},
  }

  return (
    <Link
    to="/"
    style={{
      textDecoration: `none`,
    }}
  >
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
          </div>
        </header>
     
    </PageTransition>
    </Link>
  )
}
export default Header
