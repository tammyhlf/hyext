import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import copy from 'copy-to-clipboard'
import './index.hycss'
import {Link} from "react-router-dom";

const {View,Text,Button,BackgroundImage,Image,Modal,Avatar} = UI

class Create extends Component {

    constructor(props) {
        super(props)
        this.state = {
            roomId : "",
            streamerNick:"",
            streamerAvatarUrl:"",
            streamerUnionId:"",
        };
    }

    handleCopy= (e) =>{
        copy(this.state.roomId)
        console.log(this.state.roomId)
    }

    componentWillMount() {
    }

    componentDidMount() {
        hyExt.onLoad(()=> {    //小程序生命周期
            hyExt.context.getStreamerInfo().then(userInfo => {    //获取用户信息
                console.log(userInfo,"获取主播信息");
                // console.log(userInfo.streamerNick);
                this.setState({
                  streamerNick:userInfo.streamerNick,
                  streamerAvatarUrl:userInfo.streamerAvatarUrl,
                  streamerUnionId:userInfo.streamerUnionId,
                })
                this.postData();
            })
        });
    }

    postData = () => {
        let args = []
        args[0] = {}
        args[0].header = {
            "Content-Type":"application/json;charset=UTF-8",
            // 'content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json'
        }
        args[0].url = ("http://121.196.176.201:8082/game/create?nickName="+this.state.streamerNick+"&picUrl="+this.state.streamerAvatarUrl+"&unionId="+this.state.streamerUnionId)
        args[0].method = "POST"
        args[0].data = {}  //请求的body
        args[0].dataType = "json"    //返回的数据格式
        console.log('发送HTTP请求：' + JSON.stringify(args))
        hyExt.request(args[0]).then(resp => {
            console.log('发送HTTP请求成功，返回：' + JSON.stringify(resp))
            console.log('房间号---------------->发送HTTP请求成功，返回：' + JSON.stringify(resp.data.result))
            this.setState({roomId:JSON.stringify(resp.data.result)})
        }).catch(err => {
            console.log('发送HTTP请求失败，错误信息：' + err.message)
        })

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
                                src={this.state.streamerAvatarUrl}
                            />
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
                        width:460
                    }}>
                        <View className="streamerName">
                            <Text className="streamerName-txt">{this.state.streamerNick}</Text>
                        </View>
                        <View className="streamerName">
                            <Text className="streamerName-txt">等待加入</Text>
                        </View>
                    </View>
                    <Button className="invite" type="primary" onPress={() => {
                        this._modal.open()
                    }}>邀请对手</Button>
                    <Modal
                        ref={(c) => { this._modal = c; }}
                        cancelable={true}
                        style={{
                            flex: 1,
                            marginHorizontal: 40,
                        }}>
                        <BackgroundImage src={require('../../assets/modal.png')} style={{width:300,height:235}}>
                            <View style={{borderRadius: 20,minWidth: 100, height: 200, alignItems: 'center', justifyContent: 'center'}}>
                                <Text className="txt">您的房间号码为：</Text>
                                <Text className="txt">{this.state.roomId}</Text>
                                <Button className="copy" size='sm' type="primary" onPress={this.handleCopy}>点击复制</Button>
                                <Text className="txt">分享号码给好友，输入房间号即可对战</Text>
                            </View>
                        </BackgroundImage>
                    </Modal>
                    <Button className="start" type="primary" disabled>开始对战</Button>
                </View>
            </BackgroundImage>
        )
    }
}
export default Create