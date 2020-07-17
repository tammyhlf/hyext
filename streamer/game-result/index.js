import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'

const { View, Button, Image, Icon, BackgroundImage, Text, Avatar } = UI

class GameResult extends Component {
  constructor(props) {
    super(props)
  }
  
  handleClick = () => {
    this.props.history.push('/punishment-draw')
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
          </View>
          <View>
            <Image className="avatar-img lose-back" src={require('../../assets/modal.png')} />
            <Image className="lose" src={require('../../assets/lose.png')} />
            <Text className="text">这还是一个名字</Text>
          </View>
        </View>
        <View className="btn-group">
          <Button className="punish-btn" size="lg" textStyle={{color: 'white'}} onPress={this.handleClick}>再来一局</Button>
        </View>
        <View className="game-restart">
          <Text className="text">退出房间</Text>
          <Icon type='angle-right' size={24} tintColor="#ffffff" className="game-icon" />
        </View>
      </BackgroundImage>
    )
  }
}

export default GameResult