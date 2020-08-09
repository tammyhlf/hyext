import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import { ApiUrl, circle } from '../context/user'
import { RootContext } from '../context'

const { View, Button, Image, Text, BackgroundImage, Avatar, Tip} = UI

class Punishment extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      otherStreamerNick: this.props.location.state.otherStreamerNick,
      otherStreamerAvatarUrl: this.props.location.state.otherStreamerAvatarUrl,
      otherStreamerUnionId: this.props.location.state.otherStreamerUnionId,
      roomId: this.props.location.state.roomId,
      score: this.props.location.state.score,
      dataObj: this.props.location.state.dataObj
    }
  }
  static contextType = RootContext

  componentDidMount() {
    if (!this.context.user) {
      this.props.func.requestUserInfo().then(res => {
        this.setState({
          userInfo: res.user
        })
        this.monitor()
      })
    } else {
      this.setState({
          userInfo: this.context.user
      })
      this.monitor()
    }
    const { dataObj, otherStreamerUnionId, score } = this.state
    console.log(this.state.score, dataObj[otherStreamerUnionId])
    if (score == dataObj[otherStreamerUnionId]) {
      Tip.show("双方已成平手，游戏结束", 2000, false,'top')
      setTimeout(this.handlePushResult, 2000)
    }
  }

  handlePushResult = () => {
    const {dataObj, otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, roomId} = this.state
    this.props.history.push({ pathname: '/game-result', state: {
      otherStreamerNick,
      otherStreamerAvatarUrl,
      otherStreamerUnionId,
      winner: dataObj.winner,
      dataObj,
      roomId
    }})
  }
  
  // 监听胜利方选择x
  monitor = () => {
    const { userInfo, dataObj, otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, roomId} = this.state
    if (this.context.user.streamerUnionId != dataObj.winner) {
      const callback = (res) => {
        console.log(`punishment监听的数据${JSON.parse(JSON.stringify(res))}`)
        const randomMath = res
        if (randomMath == -1) {
          this.props.history.push({ pathname: '/game-result', state: {
            otherStreamerNick,
            otherStreamerAvatarUrl,
            otherStreamerUnionId,
            winner: dataObj.winner,
            dataObj,
            roomId
          }})
        } else if (randomMath >= 0) {
          this.props.history.push({ pathname: '/punishment-draw', state: {
            otherStreamerNick,
            otherStreamerAvatarUrl,
            otherStreamerUnionId,
            roomId,
            randomMath,
            winner: dataObj.winner,
            dataObj
          }})
        }
      }
      hyExt.observer.on('result', callback)
    }
  }
  
  handleClick = () => {
    const {dataObj, otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, roomId} = this.state
    this.props.history.push({ pathname: '/punishment-draw', state: {
      otherStreamerNick,
      otherStreamerAvatarUrl,
      otherStreamerUnionId,
      winner: dataObj.winner,
      roomId,
      dataObj
    }})
  }

  handleCustomClick = () => {
    const {dataObj, otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, roomId} = this.state
    let params = {
      header: {
        "Content-Type":"application/json;charset=UTF-8",
        'Accept': 'application/json'
      },
      url: `${ApiUrl}${circle}?roomID=${roomId}&punishmentID=-1`,
      method: "POST",
      data: {},
      dataType: "json"
    }
    hyExt.request(params).then(res => {
      console.log('发送HTTP请求成功，返回：' + JSON.stringify(res))
      this.props.history.push({ pathname: '/game-result', state: {
        otherStreamerNick,
        otherStreamerAvatarUrl,
        otherStreamerUnionId,
        winner: dataObj.winner,
        dataObj,
        roomId
      }})
    }).catch(err => {
        console.log('发送HTTP请求失败，错误信息：' + err.message)
    })
  }

  handleClickHome = () => {
    this.props.history.push('/index_streamer_pc_anchor_panel.html')
  }

  render () {
    const { dataObj, otherStreamerUnionId, score, otherStreamerNick, userInfo } = this.state
    const otherScore = dataObj[otherStreamerUnionId]
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
        {score == otherScore ? null :
          <Image className={dataObj.winner == otherStreamerUnionId ? "crown" : "right-crown" } src={require("../../assets/crown.png")} />
        }
        {/*双方头像*/}
        <View  className="pkImage" style={{
          flexDirection: "row",
          width:375,
        }}>
          <View className="yellow-user">
            <Avatar
                size="l"
                borderWidth={3}
                borderColor="#ffb700"
                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                src={this.state.otherStreamerAvatarUrl}
            />
          </View>
          <View className="blue-user">
            <Avatar
                size="l"
                borderWidth={3}
                borderColor="#3a5ede"
                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                src={this.state.userInfo.streamerAvatarUrl}
            />
          </View>
        </View>

        {/*获胜or失败标志*/}
        <View style={{
          flexDirection: "row",
          width:375
        }}>
          <View className="yellow-user">
            {
              score == otherScore ? null : dataObj.winner == otherStreamerUnionId ? <Image className="win" src={require('../../assets/win.png')} /> :
              <Image className="lose" src={require('../../assets/lose.png')} />
            }
            {/* <Image className="win" src={require('../../assets/win.png')} /> */}
          </View>
          <View className="blue-user">
            {
              score == otherScore ? null : dataObj.winner == userInfo.streamerUnionId? <Image className="win" src={require('../../assets/win.png')} /> :
              <Image className="lose" src={require('../../assets/lose.png')} />
            }
            {/* <Image className="lose" src={require('../../assets/lose.png')} /> */}
          </View>
        </View>

        {/*双方名字以及得分*/}
        <View style={{
          flexDirection: "row",
          width:375
        }}>
          <View className="streamerName">
            <Text className="streamerName-txt">{otherStreamerNick}</Text>
            <Text className="streamerScore-yellow">得分：{dataObj[otherStreamerUnionId]}</Text>
          </View>
          <View className="streamerName">
            <Text className="streamerName-txt">{userInfo.streamerNick}</Text>
            <Text className="streamerScore-blue">得分：{score}</Text>
          </View>
        </View>


        <View className="btn-group">
          <Button
            disabled={ score == otherScore || dataObj.winner == otherStreamerUnionId}
            className="punish-btn"
            textStyle={{color: 'white'}}
            onPress={this.handleClick}
          >抽取惩罚</Button>
          <Button
            disabled={ score == otherScore || dataObj.winner == otherStreamerUnionId}
            className="custom-btn"
            textStyle={{color: 'white'}}
            onPress={this.handleCustomClick}
          >自定义惩罚</Button>
        </View>
      </BackgroundImage>
    )
  }
}

export default Punishment