import React, { Component } from 'react'
import './Button.css'

export default class Button extends Component<any, any> {
  render() {
    return (
      <div className="orangeBorder">
        <button className="btn">
          <ArrowRight />
          CLICK ME!!
          <ArrowLeft />
        </button>
      </div>
    )
  }
}

function ArrowRight() {
  return (
    <span className="rightArrow">
      <div className="fa fa-arrow-right" />
    </span>
  )
}

function ArrowLeft() {
  return (
    <span className="leftArrow">
      <div className="fa fa-arrow-left" />
    </span>
  )
}
