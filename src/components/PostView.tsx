import React from "react"
import { Link } from "gatsby"
import Img, { FluidObject } from "gatsby-image"
import styled from "styled-components"

const Card = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 5px;
  background: white;
  position: relative;
  display: flex;
  align-items: flex-end;
  transition: 0.4s ease-out;
  &:hover {
    transform: translateY(20px);
    &:before {
      opacity: 1;
    }
    .bg-bar {
      border-radius: 5px;
      height: 100%;
    }
    .info {
      padding-bottom: 7.5rem;
      p:nth-last-child(1) {
        opacity: 1;
      }
      transform: translateY(0px);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    filter: brightness(100%);
    top: 0;
    left: 0;
    border-radius: 5px;
    transition: 1s;
  }

  .bg-bar {
    position: absolute;
    border-radius: 0 0 5px 5px;
    width: 100%;
    height: 120px;
    background: rgba(0, 0, 0, 0.3);
    transition: 0.5s;
  }

  .info {
    position: relative;
    z-index: 3;
    color: white;
    padding-left: 1.5rem;
    transform: translateY(30px);
    transition: 0.5s;
    h1 {
      margin: 0px;
    }

    p {
      letter-spacing: 1px;
      font-size: 15px;
      margin-top: 8px;
    }

    p:nth-last-child(1) {
      opacity: 0;
    }
  }
`

interface IPostView {
  to: string
  src: string
  title: string
  date: string
  description: string
}
export default function PostView({
  to,
  src,
  title,
  date,
  description,
}: IPostView) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Card>
        <img src={src} />
        <div className="bg-bar" />
        <div className="info">
          <h1>{title}</h1>
          <p>{date}</p>
          <p>{description}</p>
        </div>
      </Card>
    </Link>
  )
}
