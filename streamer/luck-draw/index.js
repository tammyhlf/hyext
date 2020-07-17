import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import danceAction from './dance-action'

const { View, Text, Button, Image } = UI
let timer = null; //定时器，用于节流

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      wbId: "",
      wb:false,
      wb_width: 1280,  //白板的分辨率，影响白板显示清晰度
      wb_height: 720,  //白板的分辨率，影响白板显示清晰度
      recognition: {
        canvas: {
          width: 0,
          height: 0
        },
        contourCount: 0,
        contourPoints: []
      },
      result: ''
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
            const result = JSON.parse(data);
            this.setState({ result });
            this.setState({wb:true});
          }
        })
      }
    })
  }

  //在组件内加入创建白板函数
  createWb () {
    const { recognition, wb_width, wb_height } = this.state;
    const { canvas } = recognition;
    const { width , height } = canvas;
    let args = {
      type : "EXTRA",
      wbName : 'foo',
      offsetX: 0,
      offsetY: 0,
      canvasWidth : width,
      canvasHeight: height,
      width: wb_width,
      height: wb_height
    }
    hyExt.stream.createWB(args)
      .then(({ wbId }) => {
        this.setState({wbId:wbId});
      }).catch(err => {
        console.log(err);
      })
  }

  calAngle = (angle1, angle2, angle3) => {
    const k1 = (angle2.y - angle1.y) / (angle2.x - angle1.x)
    const k2 = (angle3.y - angle2.y) / (angle3.x - angle2.x)
    return Math.abs((k2 - k1) / (1 + k1 * k2))
  }

  calResult = (keypointsList) => {
    const leftArm = this.calAngle(keypointsList[10], keypointsList[11], keypointsList[12])
    const rightArm = this.calAngle(keypointsList[10], keypointsList[11], keypointsList[12])
    const leftLeg = this.calAngle(keypointsList[10], keypointsList[11], keypointsList[12])
    const rightLeg = this.calAngle(keypointsList[10], keypointsList[11], keypointsList[12])
    return { leftArm, rightArm, leftLeg, rightLeg }
  }

  /**
   * @param { Object } actionResult 定义的动作角度
   * @param { Object } distinguishResult 识别的动作角度
   * @return { Number } 
   */
  contrastResult = (actionResult = {}, distinguishResult = {}) => {
    const goodValue = 3
    const perfectValue = 1

    const result1 =  Math.abs(distinguishResult.leftArm - actionResult.leftArm)
    const result2 =  Math.abs(distinguishResult.rightArm - actionResult.rightArm)
    const result3 =  Math.abs(distinguishResult.leftLeg - actionResult.leftLeg)
    const result4 =  Math.abs(distinguishResult.rightLeg - actionResult.rightLeg)

    if (result1 < perfectValue && result2 < perfectValue && result3 < perfectValue && result4 < perfectValue) {
      return 10
    } else if (result1 < goodValue && result2 < goodValue && result3 < goodValue && result4 < goodValue) {
      return 8
    } else {
      return 0
    }
  }

  sendToWb (result) {
    if(this.state.wbId){
      // const data = JSON.stringify(this.state);
      hyExt.stream.sendToExtraWhiteBoard({
        wbId: this.state.wbId,
        data: result
      })
    }
  }

  //节流函数
  throttle(func,gapTime) {
    if(!timer){
      func.apply(this);
      timer = setTimeout(()=>{
        timer = null;
      },gapTime);
    }
  }

  componentDidMount () {
    const { wb_width, wb_height } = this.state;
    hyExt.reg.onHumanSkeletonDetection({
      width: wb_width,
      height: wb_height,
      callback: recognition => {
        this.setState({ recognition });
        const keypoints = this.state.recognition.keypoints || []
        let keypointsList = {}
        keypoints.map(item => {
          keypointsList[item.id] = item
        })
        const result = this.contrastResult(this.calResult(danceAction[0]), this.calResult(keypointsList))
        this.throttle(this.sendToWb(result), 10000);
        if(!this.state.wbId)
          this.createWb();
      }
    });
  }

  renderForm () {
    return (
      <View className='container'>
        <Text>主播屏</Text>
      </View>
    )
  }

  renderWb () {
    const { result } = this.state
    return (
      <View className='container'>
        <Text>{{ result }} </Text>
        <Image src={require('../../assets/dance-action/1.png')} />
      </View>
    )
  }

  render () {
    if(this.state.wb){
      return this.renderWb();
    }else
      return this.renderForm();
  }
}

export default App

