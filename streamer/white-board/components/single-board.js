import * as Animatable from "react-native-animatable";
import { UI } from "@hyext/hy-ui";
import "./index.hycss";
import danceAction from "../../luck-draw/dance-action";
import React, { Component } from "react";

const { View, Progress, Text, Image } = UI;

export default class SingleBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultDataMap: {
        10: require("../../../assets/dance-action/perfect.png"),
        8: require("../../../assets/dance-action/good.png"),
        0: require("../../../assets/dance-action/miss.png"),
      }
    }
  }
  render() {
    let { result, totalResult, danceIndex, start } = this.props.resultObj;
    const skin = this.props.skin;
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
      },
    };
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
      }
    };
    const tipAnimation = {
      0: {
        scale: 1,
        opacity: 0
      },
      0.1: {
        scale: 0.9,
        opacity: 1
      },
      0.3: {
        scale: 0.7,
        opacity: 0.9
      },
      0.5: {
        scale: 0.9,
        opacity: 1
      },
      0.6: {
        scale: 0.7,
        opacity: 0.8
      },
      1: {
        scale: 0.9,
        opacity: 0
      }
    }
    return (
      <View className="container">
        <Image
          src={require("../../../assets/dance-action/group-image2.gif")}
          className="logo-left"
        ></Image>
        <Animatable.View
          delay={3000}
          duration={2000}
          animation={tipAnimation}
          className="tip-left"
        >
          <Image
            src={require("../../../assets/dance-action/tip-left.png")}
            className="left-img"
          ></Image>
          <Text className="tip-text">动作识别区</Text>
        </Animatable.View>
        <Animatable.View
          delay={3000}
          duration={1500}
          animation={tipAnimation}
          className="tip-right"
        >
          <Image
            src={require("../../../assets/dance-action/tip-right.png")}
            className="left-img"
          ></Image>
        </Animatable.View>
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
          {skin == "minions" || skin == "tiger" ? (
            <Image
              src={require("../../../assets/dance-action/tiger.gif")}
              className="dance-logo"
            ></Image>
          ) : skin == "girl" ? (
            <Image
              src={require("../../../assets/dance-action/girl.gif")}
              className="dance-logo"
            ></Image>
          ) : (
            <Image
              src={require("../../../assets/dance-action/boy.gif")}
              className="dance-logo"
            ></Image>
          )}

          <Text className="result-text">得分:{totalResult || 0}</Text>
          <Progress
            easing={true}
            percent={(totalResult / 150) * 100}
            className="progress"
            style={{
              transform: [{ rotate: "-90deg" }],
            }}
            barStyle={{
              height: 50,
              width: 400,
              backgroundImage: "linear-gradient(to right, #FC8F04, #FFBF00)",
            }}
          />
        </Animatable.View>
        <View className="count-down">
          <View className="count-content">
            <Animatable.View
              animation={animates}
              className="img-content"
            >
              <Image
                src={require("../../../assets/dance-action/three.png")}
                className="img"
              ></Image>
            </Animatable.View>
            <Animatable.View
              animation={animates}
              delay={1000}
              className="img-content"
            >
              <Image
                src={require("../../../assets/dance-action/two.png")}
                className="img"
              ></Image>
            </Animatable.View>
            <Animatable.View
              animation={animates}
              delay={2000}
              className="img-content"
            >
              <Image
                src={require("../../../assets/dance-action/one.png")}
                className="img"
              ></Image>
            </Animatable.View>
          </View>
        </View>
        <Animatable.View
          duration={23550} // +850
          animation={danceAnimates}
          easing="linear"
          delay={3000}
          className="dance-contanier"
        >
          {danceAction.map((item, index) => {
            const context = require.context("../../../assets/", true, /\.png$/);
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