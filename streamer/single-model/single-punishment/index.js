import { UI } from "@hyext/hy-ui";
import React, { Component } from "react";
import "./index.hycss";
import { RootContext } from "../../context";

const { View, Button, Image, Text, BackgroundImage, Avatar, Tip } = UI;

class SinglePunishment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      score: this.props.location.state.score,
      targetScore: this.props.location.state.targetScore
    };
  }
  static contextType = RootContext;

  componentDidMount() {
    if (!this.context.user) {
      this.props.func.requestUserInfo().then((res) => {
        this.setState({
          userInfo: res.user,
        });
        this.monitor();
      });
    } else {
      this.setState({
        userInfo: this.context.user,
      });
    }
  }


  handleClick = () => {
    const {
      score,
      targetScore
    } = this.state;
    this.props.history.push({
      pathname: "/single-draw",
      state: {
        targetScore,
        score
      },
    });
  };

  handleCustomClick = () => {
    const {
      score,
      targetScore
    } = this.state;
    this.props.history.push({
      pathname: "/single-result",
      state: {
        targetScore,
        score
      },
    });
  };

  handleClickHome = () => {
    this.props.history.push("/index_streamer_pc_anchor_panel.html");
  };

  render() {
    const {
      score,
      targetScore
    } = this.state;
    return (
      <BackgroundImage
        className="backgroundImage"
        src={require("../../../assets/background.png")}
      >
        <View
          style={{
            flexDirection: "row",
            height: 40,
            padding: 20,
          }}
        >
          <View style={{ width: 10 }} onClick={this.handleClickHome}>
            <Image
              className="home"
              src={require("../../../assets/home.png")}
            ></Image>
          </View>
        </View>
        <Image src={require('../../../assets/logo.png')} className="punish-img" />
          <View className="yellow-user">
            <Avatar
              size="l"
              borderWidth={3}
              borderColor="#ffb700"
              backupSrc={require("../../../assets/fail.png")} // 网络错误显示默认图
              src={this.state.userInfo.streamerAvatarUrl}
            />
          </View>

        {/*获胜or失败标志*/}
          <View className="yellow-user">
            <Image className="lose" src={require("../../../assets/lose.png")} />
          </View>
          <View className="streamerName">
            {/* <Text className="streamerName-txt">{this.state.userInfo.streamerNick}</Text> */}
            <Text className="streamerScore-yellow">得分：{score}</Text>
            <Text className="tip">目标得分：{targetScore}</Text>
          </View>

        <View className="btn-group">
          <Button
            className="punish-btn"
            textStyle={{ color: "white" }}
            onPress={this.handleClick}
          >
            抽取惩罚
          </Button>
          <Button
            className="custom-btn"
            textStyle={{ color: "white" }}
            onPress={this.handleCustomClick}
          >
            自定义惩罚
          </Button>
        </View>
      </BackgroundImage>
    );
  }
}

export default SinglePunishment;
