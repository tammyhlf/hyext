import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './index.hycss'

const { View, Button, Image, Text } = UI

class Punishment extends Component {
  constructor(props) {
    super(props)
  }
  
  handleClick = () => {
    this.props.history.push('/punishment-draw')
  }

  handleCustomClick = () => {
    this.props.history.push('/game-result')
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
            <div style={{color:'#fca505'}}>得分：100</div>
          </div>
          <div>
            <img src={require('../../assets/blue-avatar.png')} />
            <div>这还是一个名字</div>
            <div style={{ color: '#3f64f8' }}>得分：4300</div>
          </div>
        </div>
        <div className="btn-group">
          <Button className="punish-btn" onPress={this.handleClick}>抽取惩罚</Button>
          <Button className="custom-btn" onPress={this.handleCustomClick}>自定义惩罚</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(Punishment)