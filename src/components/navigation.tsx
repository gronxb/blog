import React from "react"
import { Link } from "gatsby"
import { kebabCase } from "../lib/utils"
import PageTransition from "gatsby-plugin-page-transitions"

export default function Navigation({
  list,
}: {
  list: {
    value: string
    size: number
  }[]
}) {
  return (
    <PageTransition defalutStyle={{ position: "relative" }}>
      <div className="navigation-wrapper">
        <hr style={{width:'5px', height:'100%', position: 'absolute'}} />
        {list.map(v => (
          <Link className="navigation-item" to={`#${kebabCase(v.value)}`}>{"\t".repeat(v.size)}{v.value}</Link>
        ))}
      </div>
    </PageTransition>
  )
}
