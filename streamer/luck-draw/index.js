import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import danceAction from './dance-action'
import * as Animatable from "react-native-animatable"

const { View, Text, Button, Image } = UI
let timer = null; //定时器，用于节流

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wbId: "",
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
      result: 0
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
            this.setState({ wb: true });
          }
        })
      }
    })
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
    const goodValue = 0.9
    const perfectValue = 0.2

    const result1 = Math.abs(distinguishResult.leftArm - actionResult.leftArm) || 10  // 左手
    const result2 = Math.abs(distinguishResult.rightArm - actionResult.rightArm) || 10 // 右手
    const result3 = Math.abs(distinguishResult.leftLeg - actionResult.leftLeg) || 10 // 左脚
    const result4 = Math.abs(distinguishResult.rightLeg - actionResult.rightLeg) || 10 // 右脚
    console.log(result1, result2, result3, result4)

    if (result1 < perfectValue && result2 < perfectValue && result3 < perfectValue && result4 < perfectValue) {
      return 10
    } else if (result1 < goodValue && result2 < goodValue && result3 < goodValue && result4 < goodValue) {
      return 8
    } else {
      return 0
    }
  }

  sendToWb(result) {
    if (this.state.wbId) {
      const data = JSON.stringify(result);
      hyExt.stream.sendToExtraWhiteBoard({
        wbId: this.state.wbId,
        data
      })
    }
  }

  //节流函数
  throttle(func, gapTime) {
    if (!timer) {
      func.apply(this);
      timer = setTimeout(() => {
        timer = null;
      }, gapTime);
    }
  }

  componentDidMount() {
    const { wb_width, wb_height } = this.state;
    hyExt.reg.onHumanSkeletonDetection({
      width: wb_width,
      height: wb_height,
      callback: recognition => {
        this.setState({ recognition });
        const keypoints = this.state.recognition.keypoints[0] || []
        let keypointsList = {}
        keypoints.map(item => {
          keypointsList[item.id] = item
        })
        const result = this.contrastResult(this.calResult(danceAction[0]), this.calResult(keypointsList))
        this.throttle(() => this.sendToWb(result), 1000);
        if (!this.state.wbId)
          this.createWb();
      }
    });
  }

  renderForm() {
    return (
      <View className='container'>
        <Text>主播屏</Text>
      </View>
    )
  }

  renderWb() {
    const { result } = this.state
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
    const danceAnimates = {
      from: {
        translateY: 0
      },
      to: {
        translateY: -700
      }
    }
    return (
      <View className='container'>
        <Text style={{color:'red', fontSize: '200px'}}>{result}</Text>
        <Image src={require('../../assets/dance-action/1.png')} className="dance-action"></Image>
        {/* <View className='count-down'>
          <View className="count-content">
            <Animatable.View animation={animates} className="img-content">
              <Image src={require('../../assets/dance-action/three.png')} className="img"></Image>
            </Animatable.View>
            <Animatable.View animation={animates} delay={1000} className="img-content">
              <Image src={require('../../assets/dance-action/two.png')} className="img"></Image>
            </Animatable.View>
            <Animatable.View animation={animates} delay={2000} className="img-content">
              <Image src={require('../../assets/dance-action/one.png')} className="img"></Image>
            </Animatable.View>
          </View>
        </View> */}
        {/* <Animatable.View delay={3000} duration={1000} animation={danceAnimates} easing="linear">
          <Image src={require('../../assets/dance-action/1.png')} className="dance-action"></Image> */}
          {/* <Image src={require('../../assets/dance-action/2.png')} className="dance-even"></Image>
          <Image src={require('../../assets/dance-action/3.png')} className="dance-action"></Image>
          <Image src={require('../../assets/dance-action/4.png')} className="dance-even"></Image>
          <Image src={require('../../assets/dance-action/5.png')} className="dance-action"></Image>
          <Image src={require('../../assets/dance-action/6.png')} className="dance-even"></Image>
          <Image src={require('../../assets/dance-action/7.png')} className="dance-action"></Image>
          <Image src={require('../../assets/dance-action/8.png')} className="dance-even"></Image>
          <Image src={require('../../assets/dance-action/9.png')} className="dance-action"></Image>
          <Image src={require('../../assets/dance-action/10.png')} className="dance-even"></Image>
          <Image src={require('../../assets/dance-action/11.png')} className="dance-action"></Image>
          <Image src={require('../../assets/dance-action/12.png')} className="dance-even"></Image>
          <Image src={require('../../assets/dance-action/13.png')} className="dance-action"></Image>
          <Image src={require('../../assets/dance-action/14.png')} className="dance-even"></Image>
          <Image src={require('../../assets/dance-action/15.png')} className="dance-action"></Image> */}
        {/* </Animatable.View> */}
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

// import { UI } from '@hyext/hy-ui'
// import React, { Component } from 'react'
// import './index.hycss'

// const { View, Text, Button, Image } = UI
// let timer = null; //定时器，用于节流

// class App extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       wbId: "",
//       wb:false,
//       wb_width: 1280,  //白板的分辨率，影响白板显示清晰度
//       wb_height: 720,  //白板的分辨率，影响白板显示清晰度
//       recognition: {
//         canvas: {
//           width: 0,
//           height: 0
//         },
//         keypoints: [[{}]]
//       }
//     }

//     hyExt.env.getInitialParam().then(param => {
//       if (param.wb) {
//         // 初始化参数包含wb参数，说明处于独立白板模式
//         this.setState({
//           wb: true
//         })
//         // 监听从原来小程序发送过来的独立白板数据
//         hyExt.stream.onExtraWhiteBoardMessage({
//           // 接收到数据，刷新视图
//           callback: data => {
//             const state = JSON.parse(data);
//             this.setState(state);
//             this.setState({wb:true});
//           }
//         })
//       }
//     })
//   }

//   //在组件内加入创建白板函数
//   createWb () {
//     const { recognition, wb_width, wb_height } = this.state;
//     const { canvas } = recognition;
//     const { width , height } = canvas;
//     let args = {
//       type : "EXTRA",
//       wbName : 'foo',
//       offsetX: 0,
//       offsetY: 0,
//       canvasWidth : width,
//       canvasHeight: height,
//       width: wb_width,
//       height: wb_height
//     }
//     hyExt.stream.createWB(args)
//       .then(({ wbId }) => {
//         this.setState({wbId:wbId});
//       }).catch(err => {
//         console.log(err);
//       })
//   }

//   sendToWb () {
//     if(this.state.wbId){
//       const data = JSON.stringify(this.state);
//       hyExt.stream.sendToExtraWhiteBoard({
//         wbId: this.state.wbId,
//         data
//       })
//     }
//   }

//   //节流函数
//   throttle(func,gapTime) {
//     if(!timer){
//       func.apply(this);
//       timer = setTimeout(()=>{
//         timer = null;
//       },gapTime);
//     }
//   }

//   componentDidMount () {
//     const { wb_width, wb_height } = this.state;
//     hyExt.reg.onHumanSkeletonDetection({
//       width: wb_width,
//       height: wb_height,
//       callback: recognition => {
//         this.setState({ recognition });
//         this.throttle(this.sendToWb, 1000);
//         console.log(this.state.recognition.keypoints[0])
//         if(!this.state.wbId)
//           this.createWb();
//       }
//     });
//   }

//   renderForm () {
//     return (
//       <View className='container'>
//         <Text>主播屏</Text>
//       </View>
//     )
//   }

//   renderWb () {
//     const { recognition , wb_height , wb_width } = this.state
//     const { canvas } = recognition
//     const keypointsArr = recognition.keypoints[0] || []
//     return (
//       <View className='container'>
//         {/* <Text style={{color:'red', fontSize: '200px'}}>{keypointsArr.length}</Text> */}
//         {
//           keypointsArr.map(item => 
//             <div
//               style={{
//                 'font-size': '150px',
//                 position: 'absolute',
//                 left: wb_width * (item.x / canvas.width) + 'px',
//                 top: wb_height * (item.y / canvas.height) + 'px',
//                 color: 'yellow',
//               }}
//             >{item.id}</div>
//           )
//         }
//       </View>
//     )
//   }

//   render () {
//     if(this.state.wb){
//       return this.renderWb();
//     }else
//       return this.renderForm();
//   }
// }

// export default App

