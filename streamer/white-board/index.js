import React, { Component } from "react";
import { UI } from "@hyext/hy-ui";
import "./style.hycss";
import danceAction from "../luck-draw/dance-action";
import * as Animatable from "react-native-animatable";

const { View, Progress, Text, Image } = UI;

export default class WhiteBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skin: 'minions',
      resultObj: {},
      resultDataMap: {
        10: require("../../assets/dance-action/perfect.png"),
        8: require("../../assets/dance-action/good.png"),
        0: require("../../assets/dance-action/miss.png"),
      },
    };
  }

  componentDidMount() {
    // 监听从原来小程序发送过来的独立白板数据
    hyExt.stream.onExtraWhiteBoardMessage({
      // 接收到数据，刷新视图
      callback: (data) => {
        const resultObj = JSON.parse(data);
        if (resultObj.goods) {
          this.setState({ skin: resultObj.skin })
        } else {
          this.setState({ resultObj });
        }
      },
    }).then(() => {
      console.log('监听小程序独立白板消息成功')    
    }).catch(err => {
      console.log('监听小程序独立白板消息失败，错误信息：' + err.message)
    })
  }

  render() {
    let { result, totalResult, danceIndex, start } = this.state.resultObj;
    const { skin } = this.state
    if (!start) {
      danceIndex = danceIndex || -1;
    }
    const animates = {
      0: {
        opacity: 0,
        scale: 1,
      },
      0.1: {
        opacity: 1,
        scale: 1.2,
      },
      0.9: {
        opacity: 1,
        scale: 1,
      },
      1: {
        opacity: 0,
      },
    };
    const danceAnimates = {
      0: {
        translateY: 720,
      },
      1: {
        translateY: -7000, //动画最终停留的位置， 一共移动的距离为15*500 + 720-500 = 7720
      }
    }
    const resultAnimate = {
      0: {
        opacity: 1,
      },
      0.5: {
        opacity: 1,
      },
      0.6: {
        opacity: 0.5,
      },
      0.7: {
        opacity: 0,
      },
    };
    return (
      <View className="container">
        <Image
          src={require("../../assets/dance-action/group-image2.gif")}
          className="logo-left"
        ></Image>
        <Animatable.View
          delay={4000}
          animation={{
            from: {
              opacity: 0,
            },
            to: {
              opacity: 1,
            },
          }}
          className="progress-content"
        >
          {skin == 'minions' || skin == 'tiger' ? 
            <Image
              src={require("../../assets/dance-action/tiger.gif")}
              className="dance-logo"
            ></Image> : skin == 'girl' ?
            <Image
              src={require("../../assets/dance-action/girl.gif")}
              className="dance-logo"
            ></Image> :
            <Image
              src={require("../../assets/dance-action/boy.gif")}
              className="dance-logo"
            ></Image>
          }
          
          <Text className="result-text">得分：{totalResult || 0}</Text>
          <Progress
            easing={true}
            percent={(totalResult / 150) * 100}
            className="progress"
            style={{
              transform: [{ rotate: "-90deg" }],
            }}
            barStyle={{
              height: 30,
              width: 330,
              backgroundImage: "linear-gradient(to right, #FC8F04, #FFBF00)",
            }}
          />
        </Animatable.View>
        <View className="count-down">
          <View className="count-content">
            <Animatable.View
              animation={animates}
              delay={1000}
              className="img-content"
            >
              <Image
                src={require("../../assets/dance-action/three.png")}
                className="img"
              ></Image>
            </Animatable.View>
            <Animatable.View
              animation={animates}
              delay={2000}
              className="img-content"
            >
              <Image
                src={require("../../assets/dance-action/two.png")}
                className="img"
              ></Image>
            </Animatable.View>
            <Animatable.View
              animation={animates}
              delay={3000}
              className="img-content"
            >
              <Image
                src={require("../../assets/dance-action/one.png")}
                className="img"
              ></Image>
            </Animatable.View>
          </View>
        </View>
        <Animatable.View
          duration={23550}  // +400
          animation={danceAnimates}
          easing="linear"
          delay={4000}
          className="dance-contanier"
        >
          {danceAction.map((item, index) => {
            const context = require.context("../../assets/", true, /\.png$/);
            return (
              <Animatable.View
                key={index}
                animation={danceIndex == index ? resultAnimate : null}
                className="dance-border"
              >
                <Image
                  src={
                    danceIndex == index
                      ? this.state.resultDataMap[result]
                      : danceIndex > index
                        ? ""
                        : context(`./${skin}/${index + 1}.png`)
                  }
                  className={index % 2 == 0 ? "dance-action" : "dance-second"}
                ></Image>
              </Animatable.View>
            );
          })}
        </Animatable.View>
      </View>
    );
  }
}
