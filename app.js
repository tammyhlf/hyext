import React, { Component, createContext } from 'react'
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Home from './streamer/home'
import LuckDraw from './streamer/luck-draw'
import PunishmentDraw from './streamer/punishment-draw'
import Punishment from './streamer/punishment'
import GameResult from './streamer/game-result'
import Add from "./streamer/add";
import Create from "./streamer/create";
import Wait from "./streamer/wait";
import Record from "./streamer/record";
import { root, RootContext, requestUserInfo } from './streamer/context'

const func = {
  requestUserInfo,
}

class App extends Component {
  render () {
    return (
      <RootContext.Provider value={root}>
        <Router>
          <Switch>
            <Route path="/punishment-draw" render={ () => <PunishmentDraw func={func} /> } />
            <Route path="/punishment" render={ () => <Punishment func={func} /> } />
            <Route path="/game-result" render={ () => <GameResult func={func} />} />
            <Route path="/luck-draw" render={ () => <LuckDraw func={func} />} />
            <Route path="/wait" render={ () => <Wait func={func} />}/>
            <Route path="/record" render={ () => <Record func={func} />}/>
            <Route path="/add" render={ () => <Add func={func} />}/>
            <Route path="/create" render={ () => <Create func={func} />}/>
            <Route path="/index_streamer_pc_anchor_panel.html" render={ () => <Home func={func} /> } />
          </Switch>
        </Router>
      </RootContext.Provider>
    )
  }
}

export default App