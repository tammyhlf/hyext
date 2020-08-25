import React, { Component, createContext } from 'react'
import { Route, Router } from "@hyext/router";
import Home from './streamer/home'
import LuckDraw from './streamer/luck-draw'
import PunishmentDraw from './streamer/punishment-draw'
import Punishment from './streamer/punishment'
import GameResult from './streamer/game-result'
import Add from "./streamer/add";
import Create from "./streamer/create";
import Wait from "./streamer/wait";
import Shop from "./streamer/shop"
import Record from "./streamer/record";
import { root, RootContext, requestUserInfo } from './streamer/context'
import SingleDance from './streamer/single-model/single-dance';
import SingleResult from './streamer/single-model/single-reslut';
import SingleDraw from './streamer/single-model/single-draw';
import SinglePunishment from './streamer/single-model/single-punishment';

const func = {
  requestUserInfo,
}

class App extends Component {
  render () {
    return (
      <RootContext.Provider value={root}>
        <Router initialEntries={['/index_streamer_pc_anchor_panel.html']}  ref={c => { this.$router = c }}>
          <Route path="/punishment-draw" render={ (props) => <PunishmentDraw {...props} func={func} /> } />
          <Route path="/punishment" render={ (props) => <Punishment {...props} func={func} /> } />
          <Route path="/game-result" render={ (props) => <GameResult {...props} func={func} />} />
          <Route path="/luck-draw" render={ (props) => <LuckDraw {...props} func={func} />} />
          <Route path="/single-dance" render={ (props) => <SingleDance {...props} func={func} />} />
          <Route path="/single-result" render={ (props) => <SingleResult {...props} func={func} />} />
          <Route path="/single-draw" render={ (props) => <SingleDraw {...props} func={func} />} />
          <Route path="/single-punishment" render={ (props) => <SinglePunishment {...props} func={func} />} />
          <Route path="/wait" render={ (props) => <Wait {...props} func={func} />}/>
          <Route path="/record" render={ (props) => <Record {...props} func={func} />}/>
          <Route path="/add" render={ (props) => <Add {...props} func={func} />}/>
          <Route path="/shop" render={ (props) => <Shop {...props} func={func} />}/>
          <Route path="/create" render={ (props) => <Create {...props} func={func} />}/>
          <Route path="/index_streamer_pc_anchor_panel.html" render={ (props) => <Home {...props} func={func} />} />
        </Router>
      </RootContext.Provider>
    )
  }
}

export default App