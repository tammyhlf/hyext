import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'

const { View, Image, Text, BackgroundImage } = UI

class PunishmentDraw extends Component {
  constructor(props) {
    super(props)
  }

  handleStart = () => {

  }

  render () {
    return (
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        <Image src={require('../../assets/logo.png')} className="punish-img" />
        <View className="draw-contanier">
          <Image src={require('../../assets/draw-bgd.png')} className="draw-bgd" />
          <View className="draw-content">
            <Image className="content-img" src={require('../../assets/draw-content.png')} />
          </View>
          <Image src={require('../../assets/draw-index.png')} className="draw-index" />
          <View onPress={this.handleStart} className="start">
            <Image className="start-img" src={require('../../assets/start.png')} />
          </View>
        </View>
        <View className="result-content">
          <View>
            <Image className="crown" src={require('../../assets/crown.png')} />
            <Image className="avatar-img" src={require('../../assets/modal.png')} />
            <Text className="text">这还是一个名字</Text>
          </View>
          <View>
            <Image className="avatar-img lose-back" src={require('../../assets/modal.png')} />
            <Text className="text">这还是一个名字</Text>
          </View>
        </View>
      </BackgroundImage>
    )
  }
}

export default PunishmentDraw