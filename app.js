import React, { Component } from 'react'
import { Router, Route, Switch, browserHistory } from "react-router";
import Home from './streamer/home'
import LuckDraw from './streamer/luck-draw'

class App extends Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Switch>
          <Route path="/luck-draw" component={LuckDraw} />
          <Route path="/" component={Home} />
        </Switch>
      </Router> 
    )
  }
}

export default App