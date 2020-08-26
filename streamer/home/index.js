import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import WhiteBoard from '../white-board'

const { View, Button, Text, Icon, Image, BackgroundImage, Modal, Dialog} = UI

//刷新队伍状态用
let myTeam = null;

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      model: '',
      captain:'',
      //PK模式disabled
      pk:true,
    };
  }

  componentDidMount() {    
    let that = this
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
    global.hyExt.env.getInitialParam().then(param => {
      this.setState({
        path: param.wb ? 'wb' : ''
      })
    })
    //每3秒，获取PK信息刷新队伍状态
    myVar = setInterval(this.getPKInfo,3000)
  }
  componentWillUnmount() {
    clearInterval(myTeam)
}

  handleClick = () => {
    const {captain} = this.state
    this.props.history.push({pathname:'/add' ,state:{
      captain: captain,
    }})
  }
  handleClick1 = () => {
    const {captain} = this.state
    this.props.history.push({ pathname:'/create' , state:{
      captain: captain,
    }})
  }
  getPKInfo = () =>{
    //获取主播PK状态
    let args = []
    args[0] = {}
    args[0].key = "getPKInfo"
    // args[0].param = { foo: 'bar' }
    console.log('获取主播PK状态：' + JSON.stringify(args))
    hyExt.backend.commonQuery(args[0]).then(resp => {
      console.log('获取主播PK状态成功，返回：' + JSON.stringify(resp))    
      // console.log('获取主播PK状态成功，返回：' + JSON.stringify(resp.onPk))
      // console.log('获取主播PK状态成功，返回：' + JSON.stringify(resp.leftTeam.memberInfos)) 
      //获取红队参赛人数
      // console.log('获取红队人数成功，返回：' + resp.leftTeam.memberInfos.length) 
      //获取红队（左边）队长信息  
      // console.log('获取主播id成功，返回：' + JSON.stringify(resp.leftTeam.memberInfos[0].unionId))    
      //根据ID判断主播在哪个队伍
      

      //设置PK模式按钮disabled
      //判断是否处于PK状态
      if(resp.onPk == true){
        //判断是否为1V1PK
        if(resp.leftTeam.memberInfos.length==1 && resp.rightTeam.memberInfos.length==1){
          if(this.state.userInfo.streamerUnionId == resp.leftTeam.memberInfos[0].unionId){
            console.log("红队")
            this.setState({
              captain:true
            })
          }
          if(this.state.userInfo.streamerUnionId == resp.rightTeam.memberInfos[0].unionId){
            console.log("蓝队")
            this.setState({
              captain:false
            })
          }
          this.setState({
            //设置PK模式按钮为可用
            pk:false
          })
        }
      } else{
        this.setState({
          //设置PK模式按钮为不可用
          pk:true
        })
      }  
    }).catch(err => {
      console.log('获取主播PK状态失败，错误信息：' + err.message)
    })
  }
  handleClick = () => {
    this.props.history.push('/add')
  }
  handleClick1 = () => {
    this.props.history.push('/create')
  }
  handleClick2 = () => {
    this.props.history.push('/record')
  }
  handleSingle = () => {
    this.props.history.push('/single-dance')
  }
  handleShop = () => {
    this.props.history.push('/shop')
  }
  handlePkModel = () => {
    this.setState({
      model: 'pk'
    })
    // this._modal.open()
    // this._dialog.open()
  }

  renderHome () {
    const { model } = this.state
    return (
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        <View className="container">
          <Image className="groupImage" src={require('../../assets/group-image.png')}/>
            {
              model == 'pk' ? 
              (<><Button className="setup"  type="primary" onPress={this.handleClick1}>创建房间</Button>
              <Button className="add" type="primary" onPress={this.handleClick}>加入房间</Button></>) :
              (<><Button className="setup" type="primary" onPress={this.handlePkModel} disabled={this.state.pk}>PK模式</Button>
              <Button className="add" type="primary" onPress={this.handleSingle}>单人模式</Button></>)
            }
            {/* <Modal
              ref={(c) => { this._modal = c; }}
              cancelable={true}
              style={{
                flex: 1,
                marginHorizontal: 70,
            }}>
              <BackgroundImage src={require('../../assets/modal1.png')} style={{width:235,height:300}}>
                <View style={{alignItems: 'center'}}>
                  <Image src={require('../../assets/pk.png')} style={{width:252,height:106}}/>
                </View>
              </BackgroundImage>
            </Modal> */}
            {/* <Dialog
              ref={(c) => {
                this._dialog = c
              }}
              body={
                <View style={{alignItems: 'center'}}>
                  <Image src={require('../../assets/pk.png')} style={{width:302,height:116}}/>
                </View>
              }
              cancelable={false}
              title='请选择自己PK所在阵营'
              // operationsLayout='column'
              operations={[
                {
                  labelText: '红队',
                  type: 'cancel',
                  onPress: () => {
                    this.setState({
                      captain:true
                    })
                    console.log('红队')
                  }
                },
                {
                  labelText: '蓝队',
                  type: 'cancel',
                  onPress: () => {
                    this.setState({
                      captain:false
                    })
                    console.log('蓝队')
                  }
                }
            ]}/> */}
            <View className="choiceDecoration" onClick={this.handleShop} style={{
                    flexDirection: "row"}}>
              <Image className="decoration" src={require("../../assets/decoration.png")}></Image>
              <Text className="choice">  选择皮肤</Text>
            </View>
            {/* <Text className="txt" onPress={this.handleClick2}>历史战绩<Icon type='angle-right' size={10} tintColor='#ffffff'></Icon></Text> */}
        </View>
      </BackgroundImage>
    )
  }

  render () {
    const { path, model } = this.state
    if (path === '') {
      return this.renderHome()
    } else if (path === 'wb') {
      return <WhiteBoard />
    }
  }
}

export default Home