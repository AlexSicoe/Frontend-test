import React, { Component } from 'react'
import Footer from './Footer'
import Header from './Header'
import TextView from './Main'
import Sidebar from './Sidebar'
import './HomePage.css'

export default class HomePage extends Component {
  render() {
    return (
      <div id="homepage">
        <Header />
        <Sidebar />
        <TextView />
        <Footer />
      </div>
    )
  }
}
