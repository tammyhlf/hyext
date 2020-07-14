import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './index.hycss'

const { View, Button, Image, Icon } = UI

class GameResult extends Component {
  constructor(props) {
    super(props)
  }
  
  handleClick = () => {
    this.props.history.push('/punishment-draw')
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
        <div className="btn-group">
          <Button className="punish-btn" onPress={this.handleClick}>再来一局</Button>
        </div>
        <div className="game-restart">
          <div>退出房间</div>
          <Icon type='angle-right' size={24} tintColor="#ffffff" className="game-icon" />
        </div>
      </div>
    )
  }
}

export default withRouter(GameResult)