import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'

const { View, Button } = UI

class PunishmentDraw extends Component {
  constructor(props) {
    super(props)
  }

  handleStart = () => {

  }

  render () {
    return (
      <div
        style={{
          height: "100%",
          background: "url("+require("../../assets/background.png")+")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}>
        <img src={require('../../assets/logo.png')} className="punish-img" />
        <div className="draw-contanier">
          <img src={require('../../assets/draw-bgd.png')} className="draw-bgd" />
          <div className="draw-content">
            <img src={require('../../assets/draw-content.png')} />
          </div>
          <img src={require('../../assets/draw-index.png')} className="draw-index" />
          <View onPress={this.handleStart} className="start">
            <img src={require('../../assets/start.png')} />
          </View>
        </div>
        <div className="result-content">
          <div>
            <img src={require('../../assets/yellow-avatar.png')} />
            <div>这是一个名字</div>
          </div>
          <div>
            <img src={require('../../assets/blue-avatar.png')} />
            <div>这还是一个名字</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PunishmentDraw