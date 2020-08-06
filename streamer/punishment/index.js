import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import { RootContext } from '../context'

const { View, Button, Image, Text, BackgroundImage, Avatar} = UI

class Punishment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo:{},
      otherStreamerNick: this.props.location.state.otherStreamerNick,
      otherStreamerAvatarUrl: this.props.location.state.otherStreamerAvatarUrl,
      otherStreamerUnionId: this.props.location.state.otherStreamerUnionId,
      roomId: this.props.location.state.roomId,
      score: this.props.location.state.score
    }
  }

  static contextType = RootContext

  componentDidMount() {
    let that = this
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
    this.monitor() // 监听小程序发送的分数与随机数
  }

  monitor = () => {
    debugger
    const callbackFun = (res) => {
      console.log(`监听的数据${res}`)
    }
    hyExt.observer.on('finish', callbackFun)
  }
  
  handleClick = () => {
    const {otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, roomId} = this.state
    this.props.history.push({ pathname: '/punishment-draw', state: {
      otherStreamerNick,
      otherStreamerAvatarUrl,
      otherStreamerUnionId,
      roomId
    }})
  }

  handleCustomClick = () => {
    this.props.history.push('/game-result')
  }

  handleClickHome = () => {
    this.props.history.push('/index_streamer_pc_anchor_panel.html')
  }

  render () {
    return (
      <BackgroundImage
        className="backgroundImage"
        src={require("../../assets/background.png")}
      >
        <View style={{
          flexDirection: "row",
          height: 40,
          padding: 20
        }}>
          <View style={{width:10}} onClick={this.handleClickHome}>
            <Image className="home" src={require('../../assets/home.png')}></Image>
          </View>
        </View>
        <Image src={require('../../assets/logo.png')} className="punish-img" />
        <Image className="crown" src={require("../../assets/crown.png")} />

        {/*双方头像*/}
        <View  className="pkImage" style={{
          flexDirection: "row",
          width:375,
        }}>
          <View className="yellow-user">
            <Avatar
                size="l"
                borderWidth={3}
                borderColor="#ffb700"
                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                src={this.state.otherStreamerAvatarUrl}
            />
          </View>
          <View className="blue-user">
            <Avatar
                size="l"
                borderWidth={3}
                borderColor="#3a5ede"
                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                src={this.state.userInfo.streamerAvatarUrl}
            />
          </View>
        </View>

        {/*获胜or失败标志*/}
        <View style={{
          flexDirection: "row",
          width:375
        }}>
          <View className="yellow-user">
            <Image className="win" src={require('../../assets/win.png')} />
          </View>
          <View className="blue-user">
            <Image className="lose" src={require('../../assets/lose.png')} />
          </View>
        </View>

        {/*双方名字以及得分*/}
        <View style={{
          flexDirection: "row",
          width:375
        }}>
          <View className="streamerName">
            <Text className="streamerName-txt">{this.state.otherStreamerNick}</Text>
            <Text className="streamerScore-yellow">得分：200</Text>
          </View>
          <View className="streamerName">
            <Text className="streamerName-txt">{this.state.userInfo.streamerNick}</Text>
            <Text className="streamerScore-blue">得分：{this.state.score}</Text>
          </View>
        </View>


        <View className="btn-group">
          <Button className="punish-btn" textStyle={{color: 'white'}} onPress={this.handleClick}>抽取惩罚</Button>
          <Button className="custom-btn" textStyle={{color: 'white'}} onPress={this.handleCustomClick}>自定义惩罚</Button>
        </View>
      </BackgroundImage>
    )
  }
}

export default Punishment