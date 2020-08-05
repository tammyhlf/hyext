import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import danceAction from './dance-action'
import { RootContext } from '../context'
import { ApiUrl, finish } from '../context/user'
import * as Animatable from "react-native-animatable"

const { View, Text, Button, Image, Progress,BackgroundImage,Avatar } = UI
let timer = null; // 定时器，用于节流
let intervalTimer = null; // 用于跳舞的

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId:this.props.location.state.roomId,
      userInfo: {},
      otherStreamerNick:this.props.location.state.otherStreamerNick,
      otherStreamerAvatarUrl:this.props.location.state.otherStreamerAvatarUrl,
      otherStreamerUnionId:this.props.location.state.otherStreamerUnionId,
      wbId: "",
      danceIndex: 0,
      wb: false,
      resultDataMap: {
        10: require('../../assets/dance-action/perfect.png'),
        8: require('../../assets/dance-action/good.png'),
        0: require('../../assets/dance-action/miss.png')
      },
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
        danceIndex: 0
      },
      totalResult: 0
    }

    hyExt.env.getInitialParam().then(param => {
      if (param.wb) {
        // 初始化参数包含wb参数，说明处于独立白板模式
        this.setState({
          wb: true
        })
        // 监听从原来小程序发送过来的独立白板数据
        hyExt.stream.onExtraWhiteBoardMessage({
          // 接收到数据，刷新视图
          callback: data => {
            const resultObj = JSON.parse(data);
            this.setState({ resultObj });
            this.setState({ wb: true });
          }
        })
      }
    })
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
    hyExt.reg.onHumanSkeletonDetection({
      width: wb_width,
      height: wb_height,
      callback: recognition => {
        this.setState({ 
          recognition,
          // roomId: this.props.location.state.roomId
        });
        if (!this.state.wbId)
          this.createWb();
      }
    });
    setTimeout(this.setIntervalFun, 1000)
  }

  //在组件内加入创建白板函数
  createWb() {
    const { recognition, wb_width, wb_height } = this.state;
    const { canvas } = recognition;
    const { width, height } = canvas;
    let args = {
      type: "EXTRA",
      wbName: 'foo',
      offsetX: 0,
      offsetY: 0,
      canvasWidth: width,
      canvasHeight: height,
      width: wb_width,
      height: wb_height
    }
    hyExt.stream.createWB(args)
      .then(({ wbId }) => {
        this.setState({ wbId: wbId });
      }).catch(err => {
        console.log(err);
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
    const goodValue = 3.2
    const perfectValue = 1.5

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

  sendToWb(result, totalResult, danceIndex) {
    let resultObj = {result, totalResult, danceIndex}
    if (this.state.wbId) {
      const data = JSON.stringify(resultObj);
      hyExt.stream.sendToExtraWhiteBoard({
        wbId: this.state.wbId,
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
    const { danceIndex, totalResult, userInfo, roomId } = this.state
    const { streamerUnionId } = userInfo
    const keypoints = this.state.recognition.keypoints[0] || []
    let keypointsList = {}
    keypoints.map(item => {
      keypointsList[item.id] = item
    })
    const calResults = this.contrastResult(this.calResult(danceAction[danceIndex]), this.calResult(keypointsList))
    this.setState({
      danceIndex:  danceIndex + 1,
      totalResult: calResults + totalResult
    })
    this.sendToWb(calResults, this.state.totalResult, danceIndex)
    console.log(`这是第${danceIndex + 1}个舞蹈动作，当前总分：${totalResult}`)
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
          "Content-Type":"application/json;charset=UTF-8",
          'Accept': 'application/json'
        },
        url: `${ApiUrl}${finish}?roomID=${roomId}&score=${this.state.totalResult}&unionId=${streamerUnionId}`,
        method: "POST",
        data: {},
        dataType: "json"
      }
      hyExt.request(params).then(res => {
        console.log('发送HTTP请求成功，返回：' + JSON.stringify(res))
        // this.props.history.push({ pathname: '/punishment', state: {
        //   otherStreamerNick: this.state.otherStreamerNick,
        //   otherStreamerAvatarUrl: this.state.otherStreamerAvatarUrl,
        //   otherStreamerUnionId: this.state.otherStreamerUnionId,
        //   roomId: this.state.roomId,
        // }})
      }).catch(err => {
          console.log('发送HTTP请求失败，错误信息：' + err.message)
      })
    }
  }

  setIntervalFun = () => {
    intervalTimer = setInterval(this.sendResult, 2000)
  }

  renderForm() {
    return (
        <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
          {/*首页、下一步图标*/}
          <View style={{
            flexDirection: "row",
            height: 40,
            padding: 20
          }}>
            <View style={{width:10}}>
              {/*<Image className="home" src={require('../../assets/home.png')}></Image>*/}
            </View>
            <View style={{width:310}}>

            </View>
            <View style={{width:10}}>
            </View>
          </View>

          <View  className="container">
            {/*logo图标*/}
            <Image className="logo1" src={require('../../assets/logo1.png')}/>
            <View style={{
              flexDirection: "row",
              height: 150,
              padding: 50
            }}>
              <View>
                <Image className="blue-avatar-bgd" src={require('../../assets/blue-avatar-bgd.png')}/>
              </View>
              <View>
                <Image className="spack-left" src={require('../../assets/spark-left.png')}/>
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
            </View>
            {/*VS图片*/}
            <Image className="vs" src={require('../../assets/vs.png')}/>
            <View style={{
              flexDirection: "row",
              height: 150,
            }}>
              <View>
                <Image className="spack-right" src={require('../../assets/spark-right.png')}/>
              </View>
              <View>
                <Image className="yellow-avatar-bgd" src={require('../../assets/yellow-avatar-bgd.png')}/>
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
            </View>
            <View style={{
              flexDirection: "row",
              width:375
            }}>
              {/*蓝方姓名*/}
              <View className="streamerName-left">
                <Text className="streamerName-txt">
                  {this.state.otherStreamerNick}
                </Text>
              </View>
              {/*黄方姓名*/}
              <View className="streamerName-right">
                <Text className="streamerName-txt">
                  {this.state.userInfo.streamerNick}
                </Text>
              </View>
            </View>
          </View>
        </BackgroundImage>
    )
  }

  renderWb() {
    const { result, totalResult, danceIndex } = this.state.resultObj
    const animates = {
      0: {
        opacity: 0,
        scale: 1
      },
      0.1: {
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
    danceAnimates = {
      0: {
        translateY: 0,
        // opacity: 1
      },
      // 0.99: {
      //   translateY: -7920,
      //   opacity: 1
      // },
      1: {
        translateY: -8000,
      }
    }
    return (
      <View className='container'>
        <View>
          <Text className="result-text">115</Text>
          <Progress
            easing={true}
            percent={60}
            style={{height: 50, width: 400,transform: [{rotate: '-90deg'}], borderRadius: '20px' }}
            barStyle={{height: 50, width: 400, backgroundImage: 'linear-gradient(to right, #FC8F04, #FFBF00)' }}
          />
        </View>
        <View className='count-down'>
          <View className="count-content">
            <Animatable.View animation={animates} className="img-content">
              <Image src={require('../../assets/dance-action/three.png')} className="img"></Image>
            </Animatable.View>
            <Animatable.View animation={animates} className="img-content">
              <Image src={require('../../assets/dance-action/two.png')} className="img"></Image>
            </Animatable.View>
            <Animatable.View animation={animates} delay={1000} className="img-content">
              <Image src={require('../../assets/dance-action/one.png')} className="img"></Image>
            </Animatable.View>
          </View>
        </View>
        <Animatable.View
          duration={30000}
          animation={danceAnimates}
          easing="linear"
          delay={1000}
        >
          { danceAction.map((item, index)=> {
            return (
              <Animatable.View
                // key={index}
                // className="draw-content"
                // transition="display"
                // style={{display: this.state.display}}
              >
                <Image
                  src={ danceIndex == index ? this.state.resultDataMap[result] : require(`../../assets/dance-action/${index + 1}.png`)}
                  className="dance-action"
                ></Image>
              </Animatable.View>
            )
          }) }
        </Animatable.View>
      </View>
    )
  }

  render() {
    if (this.state.wb) {
      return this.renderWb();
    } else
      return this.renderForm();
  }
}

export default App
