import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import Record from "../record";
import {RootContext} from "../context";

const {View,Text,Button,BackgroundImage,Image,Avatar,Tip,Modal} = UI

class Test extends Component {

    constructor(p) {
        super(p)
        this.state = {
            roomId:this.props.location.state.roomId,
            userInfo: {},
            otherStreamerNick:this.props.location.state.otherStreamerNick,
            otherStreamerAvatarUrl:this.props.location.state.otherStreamerAvatarUrl,
            otherStreamerUnionId:this.props.location.state.otherStreamerUnionId,
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
    render () {
        return (
            <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
                {/*首页、下一步图标*/}
                <View style={{
                    flexDirection: "row",
                    height: 40,
                    padding: 20
                }}>
                    <View style={{width:10}}>
                        {/*<Image className="home" src={require('../../assets/home.png')}></Image>*/}
                    </View>
                    <View style={{width:310}}>

                    </View>
                    <View style={{width:10}}>
                    </View>
                </View>

                <View  className="container">
                    {/*logo图标*/}
                    <Image className="logo1" src={require('../../assets/logo1.png')}/>
                    <View style={{
                        flexDirection: "row",
                        height: 150,
                        padding: 50
                    }}>
                        <View>
                            <Image className="blue-avatar-bgd" src={require('../../assets/blue-avatar-bgd.png')}/>
                        </View>
                        <View>
                            <Image className="spack-left" src={require('../../assets/spark-left.png')}/>
                        </View>
                        <View className="blue-user">
                            <Avatar
                                size="l"
                                borderWidth={3}
                                borderColor="#3a5ede"
                                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                                src={require('../../assets/fail.png')}
                            />
                        </View>
                    </View>
                    {/*VS图片*/}
                    <Image className="vs" src={require('../../assets/vs.png')}/>
                    <View style={{
                        flexDirection: "row",
                        height: 150,
                    }}>
                        <View>
                            <Image className="spack-right" src={require('../../assets/spark-right.png')}/>
                        </View>
                        <View>
                            <Image className="yellow-avatar-bgd" src={require('../../assets/yellow-avatar-bgd.png')}/>
                        </View>
                        <View className="yellow-user">
                            <Avatar
                                size="l"
                                borderWidth={3}
                                borderColor="#ffb700"
                                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                                src={require('../../assets/fail.png')}
                            />
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width:375
                    }}>
                        {/*蓝方姓名*/}
                        <View className="streamerName-left">
                            <Text className="streamerName-txt">
                                用户1
                                {/*{this.state.otherStreamerNick}*/}
                            </Text>
                        </View>
                        {/*黄方姓名*/}
                        <View className="streamerName-right">
                            <Text className="streamerName-txt">
                                用户2
                                {/*{this.state.otherStreamerNick}*/}
                            </Text>
                        </View>
                    </View>

                </View>
            </BackgroundImage>
        )
    }
}

export default Test