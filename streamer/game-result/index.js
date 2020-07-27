import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import { RootContext } from '../context'

const { View, Button, Image, Icon, BackgroundImage, Text, Avatar } = UI

class GameResult extends Component {
  constructor(props) {
    super(props)
      this.state = {
          userInfo:{}
      }
  }

    static contextType = RootContext
    componentDidMount() {
        let that = this
        hyExt.onLoad(()=> {
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
        })
    }
    handleClick = () => {
      this.props.history.push('/punishment-draw')
    }

  render () {
    return (
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        {/*<Image src={require('../../assets/logo.png')} className="punish-img" />*/}
        {/*<View className="result-content">*/}
        {/*  <View>*/}
        {/*    <Image className="crown" src={require('../../assets/crown.png')} />*/}
        {/*    <Image className="avatar-img" src={require('../../assets/modal.png')} />*/}
        {/*    <Image className="win" src={require('../../assets/win.png')} />*/}
        {/*    <Text className="text">这还是一个名字</Text>*/}
        {/*  </View>*/}
        {/*  <View>*/}
        {/*    <Image className="avatar-img lose-back" src={require('../../assets/modal.png')} />*/}
        {/*    <Image className="lose" src={require('../../assets/lose.png')} />*/}
        {/*    <Text className="text">这还是一个名字</Text>*/}
        {/*  </View>*/}
        {/*</View>*/}


        {/*zmc修改部分*/}
          {/*皇冠*/}
          <Image className="crown" src={require("../../assets/crown.png")} />

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
                      src={require('../../assets/fail.png')}
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
                  <Image className="win" src={require('../../assets/win.png')} />
              </View>
              <View className="blue-user">
                  <Image className="lose" src={require('../../assets/lose.png')} />
              </View>
          </View>

          {/*双方名字*/}
          <View style={{
              flexDirection: "row",
              width:375,
          }}>
              <View className="streamerName">
                  <Text className="streamerName-txt">另一位玩家</Text>
              </View>
              <View className="streamerName">
                  <Text className="streamerName-txt">{this.state.userInfo.streamerNick}</Text>
              </View>
          </View>

        <View className="btn-group">
          <Button className="punish-btn" size="lg" textStyle={{color: 'white'}} onPress={this.handleClick}>再来一局</Button>
        </View>
        <View className="game-restart">
          <Text className="text">退出房间</Text>
          <Icon type='angle-right' size={24} tintColor="#ffffff" className="game-icon" />
        </View>
      </BackgroundImage>
    )
  }
}

export default GameResult