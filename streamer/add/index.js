import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import { RootContext } from '../context'

const { View, Text, Input ,Button ,BackgroundImage ,Image ,Tip } = UI

class Add extends Component {
    constructor (p) {
        super(p)
        this.state = {
            captain: this.props.location.state.captain,
            userInfo: {},
            otherStreamerNick:"",
            otherStreamerUnionId:"",
            otherStreamerAvatarUrl:"",
        }
    }

    static contextType = RootContext
    componentDidMount() {
        console.log(this.state.captain)
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
            this.monitor()
        })
    }

    //监听小程序
    monitor = () => {
        let args = []
        //监听加入信息
        args[0] = 'join'
        args[1] = data => {
            console.log("----------->返回数据"+data)
            console.log(typeof data)//检验data数据类型
            let n = data.replace(/Player\(/g,", ").split(", "); //字符串转化为数组
            console.log(n)
            this.setState({
                otherStreamerNick:n[2].toString().slice(9,n[2].length),
                otherStreamerAvatarUrl:n[3].toString().slice(7,n[3].length),
                otherStreamerUnionId:n[1].toString().slice(8,n[1].length)
            })
        }
        hyExt.observer.on(args[0], args[1])
    }

    join =() =>{
        console.log(this.state.roomId)
        let args = []
        args[0] = {}
        args[0].header = {
            "Content-Type":"application/json;charset=UTF-8",
            // 'content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json'
        }
        args[0].url = ("http://121.196.176.201:8082/game/join?nickName="+this.state.userInfo.streamerNick+"&picUrl="+this.state.userInfo.streamerAvatarUrl+"&roomID="+this.state.roomId+"&unionId="+encodeURIComponent(this.state.userInfo.streamerUnionId))
        args[0].method = "POST"
        args[0].data = {}  //请求的body
        args[0].dataType = "json"    //返回的数据格式
        console.log('发送HTTP请求：' + JSON.stringify(args))
        hyExt.request(args[0]).then(resp => {
            console.log('发送HTTP请求成功，返回：' + JSON.stringify(resp))

            let success = resp.data.success
            let result = resp.data.result
            let message = resp.data.message

            // success校验
            if(success == true){
                Tip.show(result,500, false,'top')
                //延时操作
                setTimeout(this.goto,1000)
            }else {
                if(message == "人数已满，无法加入！"){
                    Tip.show(message,500, false,'top')
                }else{
                    Tip.show("房间不存在",500, false,'top')
                }
            }

        }).catch(err => {
            Tip.show('发送HTTP请求失败，错误信息：' + err.message)
        })
    }

    handleClick = () => {
        this.props.history.push('/index_streamer_pc_anchor_panel.html')
    }
    goto = () =>{
        const {otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, roomId, captain} = this.state
        this.props.history.push({ pathname: '/wait', state: {
                captain: captain,
                otherStreamerNick: otherStreamerNick,
                otherStreamerAvatarUrl: otherStreamerAvatarUrl,
                otherStreamerUnionId: otherStreamerUnionId,
                roomId: roomId,
            }})
        // this.props.history.push({ pathname: '/wait', state: {
        //         otherStreamerNick: this.state.otherStreamerNick,
        //         otherStreamerAvatarUrl: this.state.otherStreamerAvatarUrl,
        //         otherStreamerUnionId: this.state.otherStreamerUnionId,
        //         roomId: this.state.roomId,
        //     } })
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
                    <View style={{width:10}} onClick={this.handleClick}>
                        <Image className="home" src={require('../../assets/home.png')}></Image>
                    </View>
                    <View style={{width:310}}>

                    </View>
                    <View style={{width:10}}>
                        {/*<Image className="draw-back" src={require('../../assets/draw-back.png')}></Image>*/}
                    </View>
                </View>

                <View  className="container">
                    <Image className="logo1" src={require('../../assets/logo1.png')}/>

                    <Text className="txt">输入房间号码:</Text>
                    <Input
                        style={{ margin: 13,borderRadius:150}}
                        inputStyle={{}}
                        textAlign='center'
                        value={this.state.roomId}
                        placeholder='请输入房间号'
                        // maxLength={6}
                        onChange={(value) => {
                            this.setState({
                                roomId: value
                            })
                        }}
                    />
                    <Button className="add" type="primary" onPress={this.join}>加入房间</Button>
                </View>
            </BackgroundImage>
        )
    }
}
export default Add