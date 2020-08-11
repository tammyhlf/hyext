import { UI } from "@hyext/hy-ui";
import React, { Component } from "react";
import "./index.hycss";
import { RootContext } from "../context";

const { View, Button, Image, Icon, BackgroundImage, Text, Avatar } = UI;

class GameResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      otherStreamerNick: this.props.location.state.otherStreamerNick,
      otherStreamerAvatarUrl: this.props.location.state.otherStreamerAvatarUrl,
      otherStreamerUnionId: this.props.location.state.otherStreamerUnionId,
      winner: this.props.location.state.winner,
      dataObj: this.props.location.state.dataObj,
      roomId: this.props.location.state.roomId
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

  //离开房间
  leave = () =>{
    let args = []
    args[0] = {}
    args[0].header = {
        "Content-Type":"application/json;charset=UTF-8",
        // 'content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Accept': 'application/json'
    }
    args[0].url = ("http://121.196.176.201:8082/game/leave?roomID="+this.state.roomId+"&unionId="+this.state.userInfo.streamerUnionId)
    args[0].method = "POST"
    args[0].data = {}  //请求的body
    args[0].dataType = "json"    //返回的数据格式
    console.log('发送HTTP请求：' + JSON.stringify(args))
    hyExt.request(args[0]).then(resp => {
        console.log('发送HTTP请求成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
        console.log('发送HTTP请求失败，错误信息：' + err.message)
    })
}

  handleClickHome = () => {
    this.props.history.push('/index_streamer_pc_anchor_panel.html')
    this.leave()
  }

  handlePlayAgain = () => {
    const {otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, roomId} = this.state
    this.props.history.push({ pathname: '/wait', state: {
      otherStreamerNick: otherStreamerNick,
      otherStreamerAvatarUrl: otherStreamerAvatarUrl,
      otherStreamerUnionId: otherStreamerUnionId,
      roomId
    }})
  }

  render() {
    const {otherStreamerAvatarUrl, userInfo, otherStreamerNick, otherStreamerUnionId, winner, dataObj} = this.state
    const otherScore = dataObj[otherStreamerUnionId]
    const score = dataObj[winner]
    return (
      <BackgroundImage
        className="backgroundImage"
        src={require("../../assets/background.png")}
      >
        <View style={{
          flexDirection: "row",
          height: 40,
          padding: 20
        }}>
          <View style={{width:10}} onClick={this.handleClickHome}>
            <Image className="home" src={require('../../assets/home.png')}></Image>
          </View>
        </View>
        <Image src={require('../../assets/logo.png')} className="punish-img" />
        {/*皇冠*/}
        {score == otherScore ? null :
          <Image className={dataObj.winner == otherStreamerUnionId ? "crown" : "right-crown" } src={require("../../assets/crown.png")} />
        }

        {/*双方头像*/}
        <View
          className="pkImage"
          style={{
            flexDirection: "row",
            width: 375,
          }}
        >
          <View className="yellow-user">
            <Avatar
              size="l"
              borderWidth={3}
              borderColor="#ffb700"
              backupSrc={require("../../assets/fail.png")} // 网络错误显示默认图
              src={otherStreamerAvatarUrl}
            />
          </View>
          <View className="blue-user">
            <Avatar
              size="l"
              borderWidth={3}
              borderColor="#3a5ede"
              backupSrc={require("../../assets/fail.png")} // 网络错误显示默认图
              src={userInfo.streamerAvatarUrl}
            />
          </View>
        </View>

        {/*获胜or失败标志*/}
        <View
          style={{
            flexDirection: "row",
            width: 375,
          }}
        >
          <View className="yellow-user">
            {
              score == otherScore ? null : dataObj.winner == otherStreamerUnionId ? <Image className="win" src={require('../../assets/win.png')} /> :
              <Image className="lose" src={require('../../assets/lose.png')} />
            }
          </View>
          <View className="blue-user">
            {
              score == otherScore ? null : dataObj.winner == userInfo.streamerUnionId? <Image className="win" src={require('../../assets/win.png')} /> :
              <Image className="lose" src={require('../../assets/lose.png')} />
            }
          </View>
        </View>

        {/*双方名字*/}
        <View
          style={{
            flexDirection: "row",
            width: 375,
          }}
        >
          <View className="streamerName">
          <Text className="streamerName-txt">{otherStreamerNick}</Text>
          </View>
          <View className="streamerName">
            <Text className="streamerName-txt">
              {userInfo.streamerNick}
            </Text>
          </View>
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
            退出房间
          </Button>
        </View>
      </BackgroundImage>
    );
  }
}

export default GameResult;
