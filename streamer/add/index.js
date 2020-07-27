import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import { RootContext } from '../context'

const { View, Text, Input ,Button ,BackgroundImage ,Image ,Tip } = UI

class Add extends Component {
    constructor (p) {
        super(p)
        this.state = {
            userInfo: {},
        }
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
        args[0].url = ("http://121.196.176.201:8082/game/join?nickName="+this.state.userInfo.streamerNick+"&picUrl="+this.state.userInfo.streamerAvatarUrl+"&roomID="+this.state.roomId+"&unionId="+this.state.userInfo.streamerUnionId)
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
            }else {
                if(message == "人数已满，无法加入！"){
                    Tip.show(message,500, false,'top')
                }else{
                    Tip.show("房间不存在",500, false,'top')
                }
            }

        }).catch(err => {
            console.log('发送HTTP请求失败，错误信息：' + err.message)
        })
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
        this.props.history.push('/index_streamer_pc_anchor_panel.html')
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
                </View>
                <Button onPress={this.join}>test</Button>
            </BackgroundImage>
        )
    }
}
export default Add