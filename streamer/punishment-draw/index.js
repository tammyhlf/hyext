import { UI } from "@hyext/hy-ui"
import React, { Component } from "react"
import "./index.hycss"
import * as Animatable from "react-native-animatable"
import { RootContext } from '../context'

const { View, Image, Text, BackgroundImage, Modal } = UI

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
      userInfo: {}
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
  handleDraw = (ref) => (this.view = ref);

  handleStart = () => {
    const random = Math.floor(Math.random() * 10)
    this.setState({ gameResult: this.state.dataMap[random % 8] })
    const angle = 720 + (random % 8) * (360 / 8)
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

  render() {
    return (
      <BackgroundImage
        className="backgroundImage"
        src={require("../../assets/background.png")}
      >
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
        <View className="result-content">
          <View>
            <Image className="crown" src={require("../../assets/crown.png")} />
            <Image
              className="avatar-img"
              src={require("../../assets/modal.png")}
            />
            <Text className="text">这是一个名字</Text>
          </View>
          <View>
            <Image
              className="avatar-img lose-back"
              src={require("../../assets/modal.png")}
            />
            <Text className="text">{this.state.userInfo.streamerNick}</Text>
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
