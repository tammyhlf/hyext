import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import { RootContext } from '../context'

const { View, Button, Image, Text, BackgroundImage } = UI

class Punishment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo:{}
    }
  }

  static contextType = RootContext

  componentDidMount() {
    let that = this
    hyExt.onLoad(()=> {
      if (!this.context.user) {
        this.props.func.requestUserInfo().then(res => {
          that.setState({
            userInfo: res.user
          })
        })
      } else {
        that.setState({
          userInfo: that.context.user
        })
      }
    })
  }
  
  handleClick = () => {
    console.log('this ->', this)
    this.props.history.push('/punishment-draw')
  }

  handleCustomClick = () => {
    this.$router.history.push('/game-result')
  }

  render () {
    const animates = {
      0: {
        opacity: 0,
        scale: 1
      },
      0.2: {
        opacity: 1,
        scale: 1.2
      },
      0.9: {
        opacity: 1,
        scale: 1
      },
      1: {
        opacity: 0
      }
    }
    const animatesbox = {
      from: {
        translateY: 0
      },
      to: {
        translateY: -1222
      }
    }
    return (
      <BackgroundImage
        className="backgroundImage"
        src={require("../../assets/background.png")}
      >
      {/* <div style={{ height: "100%", position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
          {/* <Animatable.View animation={animatesbox} duration={6000} className="box" easing="linear">
            <Image src={require('../../assets/dance-action/three.png')} style={{ width: '306px', height: '306px' }}></Image>
            <Image src={require('../../assets/dance-action/two.png')} style={{ width: '306px', height: '306px', marginTop: '70px' }}></Image>
            <Image src={require('../../assets/dance-action/three.png')} style={{ width: '306px', height: '306px', marginTop: '70px' }}></Image>
            <Image src={require('../../assets/dance-action/two.png')} style={{ width: '306px', height: '306px', marginTop: '70px' }}></Image>
          </Animatable.View> */}
          
          
        <Image src={require('../../assets/logo.png')} className="punish-img" />
        <View className="result-content">
          <View>
            <Image className="crown" src={require('../../assets/crown.png')} />
            <Image className="avatar-img" src={require('../../assets/modal.png')} />
            <Image className="win" src={require('../../assets/win.png')} />
            <Text className="text"></Text>
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

export default Punishment