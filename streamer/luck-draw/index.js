import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import danceAction from './dance-action'
import { RootContext } from '../context'
import { ApiUrl, finish } from '../context/user'
import { NativeModules } from '@hyext-beyond/hy-ui-native'
import * as Animatable from "react-native-animatable"

const { createSound } = NativeModules

const { View, Text, Image, BackgroundImage, Avatar } = UI
let timer = null; // 定时器，用于节流
let intervalTimer = null; // 用于跳舞的
let TimeoutTimer = null; //延时的

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      captain: this.props.location.state.captain, // 是否为队长
      roomId: this.props.location.state.roomId,
      userInfo: {},
      otherStreamerNick: this.props.location.state.otherStreamerNick,
      otherStreamerAvatarUrl: this.props.location.state.otherStreamerAvatarUrl,
      otherStreamerUnionId: this.props.location.state.otherStreamerUnionId,
      wbId: "",
      danceIndex: 0,
      wb: false,
      skin: 'minions',
      skinObj: {
        cye0vuh77id0k4q6: 'boy',
        cye0vuh7uaitjjt8: 'girl',
        cye0vuh7fgw0lwnx: 'tiger'
      },
      wb_width: 640,  //白板的分辨率，影响白板显示清晰度
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
          roomId: this.props.location.state.roomId
        });
      }
    });
    TimeoutTimer = setTimeout(this.setIntervalFun, 5550) // +200ms
    this.playMusic()
    this.monitor() // 监听小程序发送的分数与随机数
  }

  componentWillUnmount() {
    clearTimeout(TimeoutTimer)
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
    const { wb_width, wb_height, captain } = this.state;
    let args = {
      type: "EXTRA",
      wbName: 'foo',
      offsetX: captain ? 0 : width/2,
      offsetY: 0,
      canvasWidth: width / 2,
      canvasHeight: height,
      width: wb_width,
      height: wb_height,
      x: 0,  // 白板取中间值
      y: 0,
      force: true
    }
    hyExt.stream.createWB(args)
      .then(({ wbId }) => {
        this.setState({ wbId });
        setTimeout(() => this.checkGoods(wbId), 1000)
      }).catch(err => {
        console.log(err);
      })
  }

  // 检查主播是否能使用当前皮肤
  checkGoods(wbId) {
    hyExt.storage.getItem('goodsUuid').then(value => {
      if (value == '' || value == 'minions') {
        return
      } else {
        const { skinObj } = this.state
        hyExt.revenue.checkStreamerCanUseGoods({ goodsUuid: value }).then(res => {
          if (res.isCanUse) {
            this.setState({ skin: skinObj[value]})
          } else {
            this.setState({ skin: 'minions' })
          }
          const data = JSON.stringify({
            skin: this.state.skin,
            goods: true
          })
          hyExt.stream.sendToExtraWhiteBoard({
            wbId,
            data
          }).then(() => {
          }).catch(err => {
            console.log('发送消息到小程序独立白板失败，错误信息：' + err.message)
          })
        }).catch(err => {
          console.log(err.message)
        })
      }
    }).catch(err => {
      hyExt.logger.info('获取小程序简易存储键值对失败，错误信息：' + err.message)
    })
  }

  // 监听游戏结果
  monitor = () => {
    const callbackFun = (res) => {
      const { roomId, otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, resultObj, userInfo } = this.state
      console.log(`监听的数据${JSON.stringify(res)}`)
      const formDataResult = JSON.stringify(res).split('=')
      const equal = formDataResult[15].split(')')[0] // 这是字符串类型的true/fasle!
      const dataObj = {
        [formDataResult[7].split(',')[0]]: formDataResult[10].split(')')[0],
        [formDataResult[11].split(',')[0]]: formDataResult[14].split(')')[0],
        winner: equal == 'true' ? '' : formDataResult[2].split(',')[0]
      }
      const scoreData = dataObj[userInfo.streamerUnionId]
      console.log('监听游戏结果', scoreData)
      this.props.history.push({
        pathname: '/punishment', state: {
          otherStreamerNick,
          otherStreamerAvatarUrl,
          otherStreamerUnionId,
          roomId,
          score: scoreData,
          dataObj
        }
      })
    }
    hyExt.observer.on('finish', callbackFun)
  }

  // 播放音乐
  playMusic = () => {
    const sound1 = createSound('https://vb14674090674c43-cye0vuh7.hyext.com/extResource/dance/dance.mp3', (err) => {
      sound1.play()
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
    const { danceIndex, totalResult, userInfo, roomId, otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId } = this.state
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
      let params = {
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          'Accept': 'application/json'
        },
        url: `${ApiUrl}${finish}?roomID=${roomId}&score=${this.state.totalResult}&unionId=${encodeURIComponent(streamerUnionId)}`,
        method: "POST",
        data: {},
        dataType: "json"
      }
      hyExt.request(params).then(res => {
        console.log('发送HTTP请求成功，返回：' + JSON.stringify(res))
      }).catch(err => {
        console.log('发送HTTP请求失败，错误信息：' + err.message)
      })
    }
  }

  setIntervalFun = () => {
    intervalTimer = setInterval(this.sendResult, 1500)
  }
  //离开房间
  leave = () => {
    let args = {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Accept': 'application/json'
      },
      url: ("http://121.196.176.201:8082/game/leave?roomID=" + this.state.roomId + "&unionId=" + encodeURIComponent(this.state.userInfo.streamerUnionId)),
      method: "POST",
      dataType: "json"
    }
    console.log('发送HTTP请求：' + JSON.stringify(args))
    hyExt.request(args).then(resp => {
      console.log('发送HTTP请求成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      console.log('发送HTTP请求失败，错误信息：' + err.message)
    })
  }

  handleClickHome = () => {
    this.props.history.push('/index_streamer_pc_anchor_panel.html')
    this.leave()
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
          <Animatable.View
            style={{
              flexDirection: "row",
              height: 150,
              padding: 50
            }}
            animation={leftAnimates}
            easing="ease-in"
          >
            <View>
              <Image className="blue-avatar-bgd" src={require('../../assets/blue-avatar-bgd.png')} />
            </View>
            <View>
              <Image className="spack-left" src={require('../../assets/spark-left.png')} />
            </View>
            <View className="blue-user">
              <Avatar
                size="l"
                borderWidth={3}
                borderColor="#3a5ede"
                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                src={this.state.otherStreamerAvatarUrl}
              />
            </View>
            {/*蓝方姓名*/}
            <Text className="streamerName-left">
              {this.state.otherStreamerNick}
            </Text>
          </Animatable.View>
          {/*VS图片*/}
          <Image className="vs" src={require('../../assets/vs.png')} />
          <Animatable.View
            animation={rightAnimates}
            easing="ease-in"
            style={{
              flexDirection: "row",
              height: 150,
            }}
          >
            <View>
              <Image className="spack-right" src={require('../../assets/spark-right.png')} />
            </View>
            <View>
              <Image className="yellow-avatar-bgd" src={require('../../assets/yellow-avatar-bgd.png')} />
            </View>
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

export default App
