import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from './streamer/home'
import LuckDraw from './streamer/luck-draw'

class App extends Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/" component={LuckDraw} />
        </Switch>
      </Router> 
    )
  }
}

export default App