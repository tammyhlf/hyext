import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import {Link} from "react-router-dom";


const { View,Text,Button,BackgroundImage,Image,Modal,Avatar} = UI

class Wait extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };
    }

    render() {
        return (
            <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
                {/*首页、下一步图标*/}
                <View style={{
                    flexDirection: "row",
                    height: 40,
                    padding: 20
                }}>
                    <View style={{width:10}}>
                        <Link to={'/index_streamer_pc_anchor_panel.html'}>
                            <Image className="home" src={require('../../assets/home.png')}></Image>
                        </Link>
                    </View>
                    <View style={{width:310}}>

                    </View>
                    <View style={{width:10}}>
                        <Link to={'/wait'}>
                            <Image className="draw-back" src={require('../../assets/draw-back.png')}></Image>
                        </Link>
                    </View>
                </View>
                <View  className="container">
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
                        <View>
                            <Image className="spack-right" src={require('../../assets/spark-right.png')}/>
                        </View>
                        <View>
                            <Image className="yellow-avatar-bgd" src={require('../../assets/yellow-avatar-bgd.png')}/>
                        </View>
                    </View>
                    <View  className="pkImage" style={{
                        flexDirection: "row",
                    }}>
                        <View className="blue-user">
                            <Avatar
                                size="l"
                                borderWidth={3}
                                borderColor="#3a5ede"
                                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                                src={require('../../assets/fail.png')}
                            />
                        </View>
                        <View className="yellow-user">
                            <Avatar
                                size="l"
                                borderWidth={3}
                                borderColor="#ffb700"
                                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                                src={this.state.streamerAvatarUrl}
                            />
                        </View>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        width:460
                    }}>
                        <View className="streamerName">
                            <Text className="streamerName-txt">玩家1</Text>
                        </View>
                        <View className="streamerName">
                            <Text className="streamerName-txt">{this.state.streamerNick}</Text>
                        </View>
                    </View>
                    <Button className="start" type="primary">开始对战</Button>
                </View>
            </BackgroundImage>
        )
    }
}
export default Wait