import React from "react"
import Img, { FluidObject } from "gatsby-image"
import styled from "styled-components"

const Card = styled.div`
  width: 700px;
  height: 360px;
  border-radius: 5px;
  padding: 1.5rem;
  background: white;
  position: relative;
  display: flex;
  align-items: flex-end;
  transition: 0.4s ease-out;
  box-shadow: 0px 7px 10px rgba(black, 0.5);

  &:hover {
    img {
      filter: brightness(50%);
    }
    transform: translateY(20px);
    &:before {
      opacity: 1;
    }
    .info {
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
    transition: 0.3s;
  }
  
  .info {
    position: relative;
    z-index: 3;
    color: white;
   
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
  src: string
  title: string
  date: string
  description: string
}
export default function PostView({ src, title, date, description }: IPostView) {
  return (
    <Card>
      <img src={src} />
      <div className="info">
        <h1>{title}</h1>
        <p>{date}</p>
        <p>{description}</p>
      </div>
    </Card>
  )
}
