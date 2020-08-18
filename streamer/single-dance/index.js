import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import danceAction from './dance-action'
import { RootContext } from '../context'
import { ApiUrl, finish } from '../context/user'
import { NativeModules } from '@hyext-beyond/hy-ui-native'
import * as Animatable from "react-native-animatable"

const { createSound } = NativeModules

const { View, Text, Image, BackgroundImage, Avatar, Button } = UI
let timer = null; // 定时器，用于节流
let intervalTimer = null; // 用于跳舞的
let musicTimer = null
let readyTimer = null
let TimeoutTimer = null; //延时的

class SingleDance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      wbId: "",
      danceIndex: 0,
      wb: false,
      
      wb_width: 1280,  //白板的分辨率，影响白板显示清晰度
      wb_height: 720,  //白板的分辨率，影响白板显示清晰度
      recognition: {
        canvas: {
          width: 0,
          height: 0
        },
        keypoints: [[{}]]
      },
      resultObj: {
        result: 0,
        totalResult: 0,
        danceIndex: 0,
        start: false
      },
      totalResult: 0,
      start: false
    }
  }

  static contextType = RootContext

  componentDidMount() {
    let that = this
    const { wb_width, wb_height } = this.state;
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
    hyExt.stream.getStreamResolution().then(res => {
      const { width, height } = res
      this.createWb(width, height);
      console.log('获取图层画布布局信息成功')
    }).catch(err => {
      hyExt.logger.info('获取图层画布布局信息失败，错误信息：' + err.message)
    })

    hyExt.reg.onHumanSkeletonDetection({
      width: wb_width,
      height: wb_height,
      callback: recognition => {
        this.setState({
          recognition,
        });
      }
    });
    readyTimer = setTimeout(this.playFirstMusic, 3000)
    musicTimer = setTimeout(this.playMusic, 4000)
    TimeoutTimer = setTimeout(this.setIntervalFun, 5350)
  }

  componentWillUnmount() {
    clearTimeout(TimeoutTimer)
    clearTimeout(musicTimer)
    clearTimeout(readyTimer)
    hyExt.stream.deleteWB({ wbId: this.state.wbId }).then(() => {
      console.log('移除小程序普通白板成功')
    }).catch(err => {
      console.log('移除小程序普通白板失败，错误信息：' + err.message)
    })
    hyExt.reg.offHumanSkeletonDetection().then(() => {
      console.log('取消监听当前直播间肢体骨骼点检测消息成功')    
    }).catch(err => {
      console.log('取消监听当前直播间肢体骨骼点检测消息失败，错误信息：' + err.message)
    })
  }

  //在组件内加入创建白板函数
  createWb(width, height) {
    const { wb_width, wb_height } = this.state;
    let args = {
      type: "EXTRA",
      wbName: 'foo',
      offsetX: 0,
      offsetY: 0,
      canvasWidth: width,
      canvasHeight: height,
      width: wb_width,
      height: wb_height,
      x: 0,
      y: 0,
      force: true
    }
    console.log('创建白板', JSON.stringify(args))
    hyExt.stream.createWB(args)
      .then(({ wbId }) => {
        this.setState({ wbId });
      }).catch(err => {
        console.log(err);
      })
  }

  // 播放音乐
  playMusic = () => {
    const sound1 = createSound('https://vb14674090674c43-cye0vuh7.hyext.com/extResource/dance/dance.mp3', (err) => {
      sound1.setVolume(0.4)  
      sound1.play()
    })
  }

  playFirstMusic = () => {
    const sounds = createSound('https://vb14674090674c43-cye0vuh7.hyext.com/extResource/dance/ready.mp3', (err) => {
      sounds.play()
    })
  }
  // 卡点音效
  playShortMusic = () => {
    const sound = createSound('https://vb14674090674c43-cye0vuh7.hyext.com/extResource/dance/ding.mp3', (err) => {
      sound.play()
    })
  }

  calAngle = (angle1 = { x: 0, y: 0 }, angle2 = { x: 0, y: 0 }, angle3 = { x: 0, y: 0 }) => {
    const k1 = (angle2.y - angle1.y) / (angle2.x - angle1.x)
    const k2 = (angle3.y - angle2.y) / (angle3.x - angle2.x)
    return Math.abs((k2 - k1) / (1 + k1 * k2))
  }

  calResult = (keypointsList) => {
    const leftArm = this.calAngle(keypointsList['5'], keypointsList['7'], keypointsList['9'])
    const rightArm = this.calAngle(keypointsList['6'], keypointsList['8'], keypointsList['10'])
    const leftLeg = this.calAngle(keypointsList['11'], keypointsList['13'], keypointsList['15'])
    const rightLeg = this.calAngle(keypointsList['12'], keypointsList['14'], keypointsList['16'])
    return { leftArm, rightArm, leftLeg, rightLeg }
  }

  /**
   * @param { Object } actionResult 定义的动作角度
   * @param { Object } distinguishResult 识别的动作角度
   * @return { Number } 
   */
  contrastResult = (actionResult = {}, distinguishResult = {}) => {
    const goodValue = 3.5
    const perfectValue = 1.6

    const result1 = Math.abs(distinguishResult.leftArm - actionResult.leftArm) || 10  // 左手
    const result2 = Math.abs(distinguishResult.rightArm - actionResult.rightArm) || 10 // 右手
    const result3 = Math.abs(distinguishResult.leftLeg - actionResult.leftLeg) || 10 // 左脚
    const result4 = Math.abs(distinguishResult.rightLeg - actionResult.rightLeg) || 10 // 右脚
    console.log(result1, result2, result3, result4)

    if (result1 + result2 + result3 + result4 < perfectValue) {
      return 10
    } else if (result1 + result2 + result3 + result4 < goodValue) {
      return 8
    } else {
      return 0
    }
  }

  sendToWb(result, totalResult, danceIndex, start) {
    let resultObj = { result, totalResult, danceIndex, start }
    const { wbId } = this.state
    if (wbId) {
      const data = JSON.stringify(resultObj);
      hyExt.stream.sendToExtraWhiteBoard({
        wbId,
        data
      })
    }
  }

  //节流函数
  throttle(func, gapTime, resolve) {
    if (!timer) {
      func.apply(this);
      timer = setTimeout(() => {
        timer = null;
        resolve()
      }, gapTime);
    }
  }

  sendResult = () => {
    const { danceIndex, totalResult, userInfo } = this.state
    const { streamerUnionId } = userInfo
    const keypoints = this.state.recognition.keypoints[0] || []
    let keypointsList = {}
    keypoints.map(item => {
      keypointsList[item.id] = item
    })
    const calResults = this.contrastResult(this.calResult(danceAction[danceIndex]), this.calResult(keypointsList))
    this.setState({
      danceIndex: danceIndex + 1,
      totalResult: calResults + totalResult,
      start: true
    })
    this.sendToWb(calResults, this.state.totalResult, danceIndex, this.state.start)
    this.playShortMusic()
    console.log(`这是第${danceIndex + 1}个舞蹈动作，当前总分：${this.state.totalResult}`)
    // 舞蹈动作结束后
    if (danceIndex == 14) {
      clearInterval(intervalTimer);
      this.setState({
        resultObj: {
          ...this.state.resultObj,
          result: -1
        }
      })
      this.props.history.push({
        pathname: '/game-result', state: {
          score: this.state.totalResult
        }
      })
    }
  }

  setIntervalFun = () => {
    intervalTimer = setInterval(this.sendResult, 1500)
  }
  handlePlayAgain = () => {
    this.props.history.push('/single-dance')
  }

  handleClickHome = () => {
    this.props.history.push('/index_streamer_pc_anchor_panel.html')
  }

  render() {
    const leftAnimates = {
      from: {
        translateX: -344
      },
      to: {
        translateX: 0
      }
    }
    const rightAnimates = {
      from: {
        translateX: 344,
      },
      to: {
        translateX: 0
      }
    }
    return (
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        {/*首页、下一步图标*/}
        <View style={{
          flexDirection: "row",
          height: 40,
          padding: 20
        }}>
          <View style={{ width: 10 }} onClick={this.handleClickHome}>
            <Image className="home" src={require('../../assets/home.png')}></Image>
          </View>
        </View>

        <View className="container">
          {/*logo图标*/}
          <Image className="logo1" src={require('../../assets/logo1.png')} />
          {/*VS图片*/}
          <Animatable.View
            animation={rightAnimates}
            easing="ease-in"
            style={{
              flexDirection: "row",
              height: 150,
            }}
          >
            <View className="yellow-user">
              <Avatar
                size="l"
                borderWidth={3}
                borderColor="#ffb700"
                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                src={this.state.userInfo.streamerAvatarUrl}
              />
            </View>
            {/*黄方姓名*/}
            <Text className="streamerName-right">
              {this.state.userInfo.streamerNick}
            </Text>
          </Animatable.View>
        </View>
      </BackgroundImage>
    )
  }
}

export default SingleDance
