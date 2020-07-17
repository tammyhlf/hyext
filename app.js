import React, { Component } from 'react'
import { Router, Route, Switch, browserHistory } from "react-router";
import Home from './streamer/home'
// import LuckDraw from './streamer/luck-draw'
import PunishmentDraw from './streamer/punishment-draw'
import Punishment from './streamer/punishment'
import GameResult from './streamer/game-result'
import Add from "./streamer/add";
import Create from "./streamer/create";
import Wait from "./streamer/wait";

class App extends Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Switch>
          <Route path="/punishment-draw" component={() => <PunishmentDraw />} />
          <Route path="/punishment" component={() => <Punishment />} />
          <Route path="/game-result" component={GameResult} />
          <Route path="/luck-draw" component={() => <LuckDraw/>} />
          <Route path="/wait" component={Wait}/>
          <Route path="/add" component={Add} />
          <Route path="/create" component={Create}/>
          <Route path="/index_streamer_pc_anchor_panel.html" component={Home} />
        </Switch>
      </Router> 
    )
  }
}

export default App