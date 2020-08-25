import { UI } from "@hyext/hy-ui";
import React, { Component } from "react";
import "./index.hycss";
import { RootContext } from "../../context";

const { View, Button, Image, Icon, BackgroundImage, Text, Avatar } = UI;

class SingleResult extends Component {
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
    let that = this;
    hyExt.onLoad(() => {
      if (!this.context.user) {
        this.props.func.requestUserInfo().then((res) => {
          that.setState({
            userInfo: res.user,
          });
        });
      } else {
        that.setState({
          userInfo: that.context.user,
        });
      }
    });
  }

  handleClickHome = () => {
    this.props.history.push('/index_streamer_pc_anchor_panel.html')
  }

  handlePlayAgain = () => {
    this.props.history.push({ pathname: '/single-dance' })
  }

  render() {
    const { score, userInfo, targetScore } = this.state
    return (
      <BackgroundImage
        className="backgroundImage"
        src={require("../../../assets/background.png")}
      >
        <View style={{
          flexDirection: "row",
          height: 40,
          padding: 20
        }}>
          <View style={{ width: 10 }} onClick={this.handleClickHome}>
            <Image className="home" src={require('../../../assets/home.png')}></Image>
          </View>
        </View>
        <Image src={require('../../../assets/logo.png')} className="punish-img" />
        <View className="blue-user">
          <Avatar
            size="l"
            borderWidth={3}
            borderColor="#3a5ede"
            backupSrc={require("../../../assets/fail.png")} // 网络错误显示默认图
            src={userInfo.streamerAvatarUrl}
          />
          {
            score >= targetScore ? 
            <Image className="win" src={require("../../../assets/win.png")} /> :
            <Image className="lose" src={require("../../../assets/lose.png")} />
          }
          {/* <Text className="streamerName-txt">
            {userInfo.streamerNick}
          </Text> */}
          <Text className="streamerScore-yellow">得分：{score}</Text>
          <Text className="tip">
            （目标得分：{targetScore}）
          </Text>
        </View>

        <View className="btn-group">
          <Button
            className="punish-btn"
            textStyle={{ color: "white" }}
            onPress={this.handlePlayAgain}
          >
            再来一局
          </Button>
          <Button
            className="custom-btn"
            textStyle={{ color: "white" }}
            onPress={this.handleClickHome}
          >
            退出游戏
          </Button>
        </View>
      </BackgroundImage>
    );
  }
}

export default SingleResult;
