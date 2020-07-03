import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from './streamer/home'
import LuckDraw from './streamer/luck-draw'

class App extends Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route path="/luck-draw" component={LuckDraw} />
          <Route path="/" component={Home} />
        </Switch>
      </Router> 
    )
  }
}

export default App