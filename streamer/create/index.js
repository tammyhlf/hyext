import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import copy from 'copy-to-clipboard'
import './index.hycss'
import {Link} from "react-router-dom";

const { View,Text,Button,BackgroundImage,Image,Modal} = UI

class Create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mytext : "",
        };
    }
    getRoom= () =>{ //请求数据函数
        fetch(`http://localhost:3000/rooms/1`,{
            method: 'GET'
        }).then(res => res.json()).then(
            data => {
                this.setState({mytext:data})
            }
        )
    }

    handleCopy= (e) =>{
        copy(this.state.mytext.data)
        console.log(this.state.mytext.data)
    }

    componentWillMount() {
        this.getRoom()
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
                            <Image className="user1" src={require('../../assets/blue-avatar-bgd.png')}/>
                        </View>
                        <View>
                            <Image className="spack-left" src={require('../../assets/spark-left.png')}/>
                        </View>
                        <View>
                            <Image className="spack-right" src={require('../../assets/spark-right.png')}/>
                        </View>
                        <View>
                            <Image className="user2" src={require('../../assets/yellow-avatar-bgd.png')}/>
                        </View>
                    </View>
                    <View  className="pk" style={{
                        flex:1,
                        flexDirection: "row",
                    }}>
                        <View>
                            <Image className="blue-avatar" src={require('../../assets/blue-avatar.png')}/>
                        </View>
                        <View>
                            <Image className="yellow-avatar" src={require('../../assets/yellow-avatar.png')}/>
                        </View>
                    </View>
                    <Button className="invite" onPress={() => {
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
                                <Text>您的房间号码为：</Text>
                                <Text>{this.state.mytext.data}</Text>
                                <Button className="copy" size='sm' onPress={this.handleCopy}>点击复制</Button>
                                <Text>分享号码给好友，输入房间号即可对战</Text>
                            </View>
                        </BackgroundImage>
                    </Modal>
                    <Button className="start" disabled>开始对战</Button>
                </View>
            </BackgroundImage>
        )
    }
}
export default Create