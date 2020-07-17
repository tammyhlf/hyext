import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './index.hycss'

const { View, Button, Image, Text, BackgroundImage } = UI

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
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        <Image src={require('../../assets/logo.png')} className="punish-img" />
        <View className="result-content">
          <View>
            <Image className="crown" src={require('../../assets/crown.png')} />
            <Image className="avatar-img" src={require('../../assets/modal.png')} />
            <Image className="win" src={require('../../assets/win.png')} />
            <Text className="text">这还是一个名字</Text>
            <Text className="text win-score">得分：200</Text>
          </View>
          <View>
            <Image className="avatar-img lose-back" src={require('../../assets/modal.png')} />
            <Image className="lose" src={require('../../assets/lose.png')} />
            <Text className="text">这还是一个名字</Text>
            <Text className="text lose-score">得分:300</Text>
          </View>
        </View>
        <View className="btn-group">
          <Button className="punish-btn" size="lg" textStyle={{color: 'white'}} onPress={this.handleClick}>抽取惩罚</Button>
          <Button className="custom-btn" size="lg" textStyle={{color: 'white'}} onPress={this.handleCustomClick}>自定义惩罚</Button>
        </View>
      </BackgroundImage>
    )
  }
}

export default withRouter(Punishment)