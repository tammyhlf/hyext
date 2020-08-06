import { UI } from "@hyext/hy-ui"
import React, { Component } from "react"
import "./index.hycss"
import * as Animatable from "react-native-animatable"
import { RootContext } from '../context'

const { View, Image, Text, BackgroundImage, Modal,Avatar } = UI

class PunishmentDraw extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataMap: {
        0: '唱歌',
        1: '表白对面傍一',
        2: '大冒险',
        3: '喝水跳舞',
        4: '叫爸爸',
        5: '吃柠檬',
        6: '模仿五种动物叫',
        7: '真心话'
      },
      gameResult: '唱歌',
      userInfo: {},
      otherStreamerNick: this.props.location.state.otherStreamerNick,
      otherStreamerAvatarUrl: this.props.location.state.otherStreamerAvatarUrl,
      otherStreamerUnionId: this.props.location.state.otherStreamerUnionId,
      roomId: this.props.location.state.roomId
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
  }
  handleDraw = (ref) => (this.view = ref);

  handleStart = () => {
    const random = Math.floor(Math.random() * 10) // 后端返回
    this.setState({ gameResult: this.state.dataMap[random % 8] })
    const angle = 720 + (random % 7) * (360 / 7)
    let promise = new Promise(resolve => {
      this.view.transitionTo({ rotate: `${angle}deg` }, 2000, "ease-in-out");
      this.timer = setTimeout(() => resolve(), 2000)
    })
    promise.then(() => {
      this._modal.open()
    })
  }

  handleClosed = () => {
    clearTimeout(this.timer)
  }

  handleClickHome = () => {
    this.props.history.push('/index_streamer_pc_anchor_panel.html')
  }

  render() {
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
        <Image src={require("../../assets/logo.png")} className="punish-img" />
        <View className="draw-contanier">
          <Image
            src={require("../../assets/draw-bgd.png")}
            className="draw-bgd"
          />
          {/* 转盘动画 */}
          <Animatable.View ref={this.handleDraw} className="draw-content">
            <Image
              className="content-img"
              src={require("../../assets/draw-content.png")}
            />
          </Animatable.View>
          <Image
            src={require("../../assets/draw-index.png")}
            className="draw-index"
          />
          <View className="start" onClick={this.handleStart}>
            <Image
              className="start-img"
              src={require("../../assets/start.png")}
            />
          </View>
        </View>

        {/*zmc修改部分*/}

        <Image className="crown" src={require("../../assets/crown.png")} />

        <View  className="pkImage" style={{
          flexDirection: "row",
          width:375
        }}>
          <View className="blue-user">
            <Avatar
                size="l"
                borderWidth={3}
                borderColor="#3a5ede"
                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                src={this.state.userInfo.streamerAvatarUrl}
            />
          </View>
          <View className="yellow-user">
            <Avatar
                size="l"
                borderWidth={3}
                borderColor="#ffb700"
                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                src={this.state.otherStreamerAvatarUrl}
            />
          </View>
        </View>
        <View style={{
          flexDirection: "row",
          width:375
        }}>
          <View className="streamerName">
            <Text className="streamerName-txt">{this.state.userInfo.streamerNick}</Text>
          </View>
          <View className="streamerName">
            <Text className="streamerName-txt">{this.state.otherStreamerNick}</Text>
          </View>
        </View>

        <Modal
          ref={(c) => {
            this._modal = c;
          }}
          cancelable={true}
          style={{
            flex: 1,
            marginHorizontal: 40,
          }}
          onClosed={this.handleClosed}
        >
          <BackgroundImage
            src={require("../../assets/modal.png")}
            style={{ width: 300, height: 235 }}
          >
            <View
              style={{
                minWidth: 100,
                height: 200,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text">惩罚结果为：</Text>
              <Text className="game-result">{this.state.gameResult}</Text> 
            </View>
          </BackgroundImage>
        </Modal>
      </BackgroundImage>
    );
  }
}

export default PunishmentDraw
