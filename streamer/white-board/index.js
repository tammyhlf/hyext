import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'
import './style.hycss'
import danceAction from '../luck-draw/dance-action'
import * as Animatable from "react-native-animatable"

const { View, Progress, Text, Image } = UI

export default class WhiteBoard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      resultObj: {},
      resultDataMap: {
        10: require('../../assets/dance-action/perfect.png'),
        8: require('../../assets/dance-action/good.png'),
        0: require('../../assets/dance-action/miss.png')
      },
    }
  }

  componentDidMount() {
    // 监听从原来小程序发送过来的独立白板数据
    hyExt.stream.onExtraWhiteBoardMessage({
      // 接收到数据，刷新视图
      callback: data => {
        const resultObj = JSON.parse(data);
        this.setState({ resultObj });
      }
    })
  }

  render() {
    let { result, totalResult, danceIndex, start } = this.state.resultObj
    if (!start) {
      danceIndex = danceIndex || -1
    }
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
        translateY: 720,
        // opacity: 1
      },
      // 0.99: {
      //   translateY: -7920,
      //   opacity: 1
      // },
      1: {
        translateY: -7200 //动画最终停留的位置， 一共移动的距离为15*500 + 720-500 = 7720
      }
    },
    resultAnimate = {
      0: {
        scale: 0.8,
        opacity: 1
      },
      0.5: {
        scale: 1,
        opacity: 1
      },
      0.6: {
        opacity: 0.5,
        scale: 1
      },
      0.7: {
        opacity: 0,
        scale: 1
      }
    }
    return (
      <View className='container'>
        <Image src={require('../../assets/dance-action/logo.gif')} className="dance-logo"></Image>
        <Animatable.View delay={4000}
        animation={{
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }}
        className="progress-content">
          <Text className="result-text">得分：{totalResult || 0}</Text>
          <Progress
            easing={true}
            percent={totalResult / 150 * 100}
            className="progress"
            style={{
              transform: [{rotate: '-90deg'}]
            }}
            barStyle={{height: 50, width: 400, backgroundImage: 'linear-gradient(to right, #FC8F04, #FFBF00)' }}
          />
        </Animatable.View>
        <View className='count-down'>
          <View className="count-content">
            <Animatable.View animation={animates} delay={1000} className="img-content">
              <Image src={require('../../assets/dance-action/three.png')} className="img"></Image>
            </Animatable.View>
            <Animatable.View animation={animates} delay={2000} className="img-content">
              <Image src={require('../../assets/dance-action/two.png')} className="img"></Image>
            </Animatable.View>
            <Animatable.View animation={animates} delay={3000} className="img-content">
              <Image src={require('../../assets/dance-action/one.png')} className="img"></Image>
            </Animatable.View>
          </View>
        </View>
        <Animatable.View
          duration={23150}
          animation={danceAnimates}
          easing="linear"
          delay={4000}
          className="dance-contanier"
        >
          { danceAction.map((item, index)=> {
            const context = require.context("../../assets/dance-action/", true, /\.png$/)
            return (
              <View style={{
                width: 400,
                height: 500
              }}>
                <Animatable.View
                  key={index}
                  animation={ danceIndex == index ? resultAnimate : null }
                >
                  <Image
                    src={ danceIndex == index ? this.state.resultDataMap[result] : context(`./${index + 1}.png`)}
                    className="dance-action"
                  ></Image>
                </Animatable.View>
              </View>
            )
          }) }
        </Animatable.View>
      </View>
    )
  }
}