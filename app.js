import React, { Component } from 'react'
import { Router, Route, Switch, browserHistory } from "react-router";
import Home from './streamer/home'
// import LuckDraw from './streamer/luck-draw'
import PunishmentDraw from './streamer/punishment-draw'
import Punishment from './streamer/punishment'
import GameResult from './streamer/game-result'

class App extends Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Switch>
          <Route path="/punishment-draw" component={() => <PunishmentDraw />} />
          <Route path="/game-result" component={() => <GameResult />} />
          <Route path="/home" component={() => <Home />} />
          <Route path="/" component={() => <PunishmentDraw />} />
          {/* <Route path="/" component={() => <LuckDraw/>} /> */}
        </Switch>
      </Router> 
    )
  }
}

export default App