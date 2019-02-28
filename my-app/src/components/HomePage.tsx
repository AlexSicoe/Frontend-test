import React, { Component } from 'react'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Sidebar from './Sidebar'
import './HomePage.css'

export default class HomePage extends Component {
  render() {
    return (
      <div id="homepage" className="viewport">
        <Header />
        <div id="center">
          <Sidebar />
          <Main />
        </div>
        <Footer />
      </div>
    )
  }
}
