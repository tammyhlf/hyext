import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import copy from 'copy-to-clipboard'
import './index.hycss'
import { RootContext } from '../context'


const {View,Text,Button,BackgroundImage,Image,Modal,Avatar,Tip} = UI

class Create extends Component {

    constructor(props) {
        super(props)
        this.state = {
            captain: this.props.location.state.captain,
            roomId : "",
            userInfo: {},
            otherStreamerNick:"",
            otherStreamerUnionId:"",
            otherStreamerAvatarUrl:"",
            disabled:false,
            disabled1:true,
            buttonTxt:"准备对战",
            // 准备显示与否
            show: false,
            showother: false
        };
    }

    handleCopy= (e) =>{
        copy(this.state.roomId)
        console.log(this.state.roomId)
        Tip.show('复制成功', 500, true,'top')
        this._modal.close()
    }

    handleClick = () => {
        this.props.history.push('/index_streamer_pc_anchor_panel.html')
        this.leave()
    }
    //准备、开始按钮
    handleClick1 = () => {
        switch (this.state.buttonTxt) {
            case "准备对战":
                console.log("----->准备对战"+this.state.roomId)
                this.ready()
                this.setState({
                    buttonTxt:"取消准备"
                })
                break;
            case "取消准备":
                console.log("----->取消准备"+this.state.roomId)
                this.unready()
                this.setState({
                    buttonTxt:"准备对战"
                })
                break;
            case "开始对战":
                console.log("----->开始对战")
                this.ready()
                break;
        }
    }
    //跳转界面
    handleClick2 = () => {
        const {otherStreamerNick, otherStreamerAvatarUrl, otherStreamerUnionId, roomId, captain} = this.state
        this.props.history.push({ pathname: '/luck-draw', state: {
                captain: captain,
                otherStreamerNick: otherStreamerNick,
                otherStreamerAvatarUrl: otherStreamerAvatarUrl,
                otherStreamerUnionId: otherStreamerUnionId,
                roomId: roomId,
            } })
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
                    console.log("----------->打印主播号"+this.state.userInfo.streamerUnionId)
                })
            } else {
                that.setState({
                    userInfo: that.context.user
                })
            }
            this.postData()
            // 监听小程序信息
            this.monitor()
        })
    }
    componentWillUnmount() {
        // alert('componentWillUnmount');
        // console.log('componentWillUnmount');
        // this.leave()
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
            console.log("----------------->主播1，主播号"+n[1].toString().slice(8,n[1].length))
            console.log("----------------->主播1，主播昵称"+n[2].toString().slice(9,n[2].length))
            console.log("----------------->主播1，主播头像地址"+n[3].toString().slice(7,n[3].length))
            console.log("----------------->主播1，游戏结果"+n[4].toString().slice(11,n[4].length-1))


            console.log("----------------->主播2，主播号"+n[6].toString().slice(8,n[6].length))
            console.log("----------------->主播2，主播昵称"+n[7].toString().slice(9,n[7].length))
            console.log("----------------->主播2，主播头像地址"+n[8].toString().slice(7,n[8].length))
            console.log("----------------->主播2，游戏结果"+n[9].toString().slice(11,n[9].length-2))
            this.setState({
                otherStreamerNick:n[7].toString().slice(9,n[7].length),
                otherStreamerAvatarUrl:n[8].toString().slice(7,n[8].length),
                otherStreamerUnionId:n[6].toString().slice(8,n[6].length),
                disabled:true,
                disabled1:false,
            })
        }
        hyExt.observer.on(args[0], args[1])
        //监听离开信息
        args[2] = 'leave'
        args[3] = data =>{
            console.log("----------->返回数据"+data)
            console.log(typeof data)//检验data数据类型
            let n = data.replace(/Player\(/g,", ").split(", "); //字符串转化为数组
            console.log(n)
            console.log("----------------->主播1，主播号"+n[1].toString().slice(8,n[1].length))
            console.log("----------------->主播1，主播昵称"+n[2].toString().slice(9,n[2].length))
            console.log("----------------->主播1，主播头像地址"+n[3].toString().slice(7,n[3].length))
            console.log("----------------->主播1，游戏结果"+n[4].toString().slice(11,n[4].length-1))
            Tip.show("对方玩家已离开",500, false,'top')
            this.setState({
                otherStreamerNick:"",
                otherStreamerAvatarUrl:"",
                //邀请按钮显示状态
                disabled:false,
                //开始按钮显示状态
                disabled1:true,
                //对方状态显示
                showother:false,
                bottonTxt:"准备对战"
            })
        }
        hyExt.observer.on(args[2], args[3])
        //监听准备信息
        args[4] = 'ready'
        args[5] = data =>{
            console.log("----------->返回数据"+data)
            console.log(typeof data)//检验data数据类型
            let n = data.replace(/Player\(/g,", ").split(", "); //字符串转化为数组
            console.log(n)
            //判断对方准备还是己方准备
            let n0 = n[0].replace(/\{/g,"").split("=");
            let n1 = n[1].replace(/\}/g,"").split("=");
            console.log("玩家1 id:n0[0]--------->"+n0[0]);
            console.log("玩家1 状态:n0[1]--------->"+n0[1]);
            console.log("玩家2 id:n1[0]--------->"+n1[0]);
            console.log("玩家2 状态:n1[1]--------->"+n1[1]);

            //根据返回id设置状态
            //判断监听返回数据哪个为自己的id
            if(n0[0]===this.state.userInfo.streamerUnionId){
                console.log("--->n0是我的id"+n0[0])
                console.log("我的状态"+n0[1])
                if(n0[1]==="READY"){
                    this.setState({
                        show:true
                    })
                    if(n1[1]==="READY"){
                        Tip.show("双方均已准备，游戏马上开始",500, false,'top')
                        this.setState({
                            showother:true,
                            disabled1:true,
                        })
                        //跳转到跳舞界面
                        setTimeout(this.handleClick2,3000)
                    }else{
                        this.setState({
                            buttonTxt:"取消准备",
                        })
                    }
                }else{
                    this.setState({
                        buttonTxt:"开始对战",
                        showother:true,
                    })
                }
            }
            if(n0[0]===this.state.otherStreamerUnionId){
                console.log("--->n1是我的id"+n0[0])
                console.log("我的状态"+n1[1])
                if(n1[1]==="READY"){
                    this.setState({
                        show:true
                    })
                    if(n0[1]==="READY"){
                        Tip.show("双方均已准备，游戏马上开始",500, false,'top')
                        this.setState({
                            showother:true,
                            disabled1:true,
                        })
                        //跳转到跳舞界面
                        setTimeout(this.handleClick2,3000)
                    }else{
                        this.setState({
                            buttonTxt:"取消准备",
                        })
                    }
                }else{
                    this.setState({
                        buttonTxt:"开始对战",
                        showother:true,
                    })
                }
            }
        }
        hyExt.observer.on(args[4], args[5])
        //监听取消准备信息
        args[6] = 'unready'
        args[7] = data =>{
            console.log("----------->返回数据"+data)
            console.log(typeof data)//检验data数据类型
            let n = data.replace(/Player\(/g,", ").split(", "); //字符串转化为数组
            console.log(n)
            let n0 = n[0].replace(/\{/g,"").split("=");
            let n1 = n[1].replace(/\}/g,"").split("=");
            console.log("玩家1 id:n0[0]--------->"+n0[0]);
            console.log("玩家1 状态:n0[1]--------->"+n0[1]);
            console.log("玩家2 id:n1[0]--------->"+n1[0]);
            console.log("玩家2 状态:n1[1]--------->"+n1[1]);

            //根据返回id设置状态
            //判断监听返回数据哪个为自己的id
            if(n0[0]===this.state.userInfo.streamerUnionId){
                console.log("--->n0是我的id"+n0[0])
                console.log("我的状态"+n0[1])
                if(n0[1]==="IN_ROOM"){
                    this.setState({
                        show:false,
                    })
                    if(n1[1]==="IN_ROOM"){
                        this.setState({
                            buttonTxt:"准备对战"
                        })
                    }
                }
                if(n1[1]==="IN_ROOM"){
                    this.setState({
                        showother:false,
                    })
                }
            }
            if(n0[0]===this.state.otherStreamerUnionId){
                if(n0[1]==="IN_ROOM"){
                    this.setState({
                        showother:false,
                    })
                    if(n1[1]==="IN_ROOM"){
                        this.setState({
                            buttonTxt:"准备对战"
                        })
                    }
                }
                if(n1[1]==="IN_ROOM"){
                    this.setState({
                        show:false,
                    })
                }
            }
        }
        hyExt.observer.on(args[6], args[7])
    }
    //准备
    ready = () =>{
        let args = []
        args[0] = {}
        args[0].header = {
            "Content-Type":"application/json;charset=UTF-8",
            // 'content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json'
        }
        args[0].url = ("http://121.196.176.201:8082/game/status/ready?roomID="+this.state.roomId+"&unionId="+encodeURIComponent(this.state.userInfo.streamerUnionId))
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
    //取消准备
    unready = () =>{
        let args = []
        args[0] = {}
        args[0].header = {
            "Content-Type":"application/json;charset=UTF-8",
            // 'content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json'
        }
        args[0].url = ("http://121.196.176.201:8082/game/status/unready?roomID="+this.state.roomId+"&unionId="+encodeURIComponent(this.state.userInfo.streamerUnionId))
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
    //离开房间
    leave = () =>{
        let args = []
        args[0] = {}
        args[0].header = {
            "Content-Type":"application/json;charset=UTF-8",
            // 'content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json'
        }
        args[0].url = ("http://121.196.176.201:8082/game/leave?roomID="+this.state.roomId+"&unionId="+encodeURIComponent(this.state.userInfo.streamerUnionId))
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

    postData = () => {
        let args = []
        args[0] = {}
        args[0].header = {
            "Content-Type":"application/json;charset=UTF-8",
            // 'content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json'
        }
        args[0].url = ("http://121.196.176.201:8082/game/create?nickName="+this.state.userInfo.streamerNick+"&picUrl="+this.state.userInfo.streamerAvatarUrl+"&unionId="+encodeURIComponent(this.state.userInfo.streamerUnionId))
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
        let showimage = this.state.show ?
            <Image className="ready" src={require('../../assets/ready.png')}/>
            :null;
        let showimage1 = this.state.showother ?
            <Image className="ready" src={require('../../assets/ready.png')}/>
            :null;

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
                                src={this.state.userInfo.streamerAvatarUrl}
                            />
                        </View>
                        <View className="yellow-user">
                            <Avatar
                                size="l"
                                borderWidth={3}
                                borderColor="#ffb700"
                                backupSrc={require('../../assets/fail.png')} // 网络错误显示默认图
                                src={this.state.otherStreamerAvatarUrl}
                            />
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width:375
                    }}>
                        <View className="streamerName">
                            <Text className="streamerName-txt-left">{this.state.userInfo.streamerNick}</Text>
                        </View>
                        <View className="streamerName">
                            <Text className="streamerName-txt-right">{this.state.otherStreamerNick}</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width:375
                    }}>
                        <View className="readyImage">
                            {showimage}
                        </View>
                        <View className="readyImage">
                            {showimage1}
                        </View>
                    </View>
                    <Button className="invite" type="primary" onPress={() => {
                        this._modal.open()
                    }} disabled={this.state.disabled}>邀请对手</Button>
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
                    <Button className="start" type="primary" onPress={this.handleClick1} disabled={this.state.disabled1}>{this.state.buttonTxt}</Button>
                </View>
            </BackgroundImage>
        )
    }
}
export default Create