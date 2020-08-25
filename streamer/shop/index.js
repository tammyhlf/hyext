import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'

const { View, Text, Image, BackgroundImage, Modal, Button} = UI
//刷新商品状态用
let myVar = null;

class Shop extends Component {
    constructor (p) {
        super(p)
        this.state = {
            // 皮肤购买状态,是否可用
            myYellowMan:true,
            // 皮肤选择状态
            // choiceYellowMan:true,
            // choiceTiger:false,
            // choiceGirl:false,
            // choiceBoy:false,
        }
    }

    handleClick = () => {
        this.props.history.push('/index_streamer_pc_anchor_panel.html')
    }
    //购买虎小牙皮肤
    buyTiger = () => {
        //检查主播是否可以使用当前付费模块
        hyExt.revenue.checkStreamerCanUseGoods({
            goodsUuid: 'cye0vuh7fgw0lwnx'
        }).then(({ isCanUse }) => {
        hyExt.logger.info('检查成功：' + isCanUse)
        }).catch(err => {
        hyExt.logger.warn('检查失败：' + err.message)
        })
        //弹出商品购买的H5面板
        // hyExt.revenue.popupGoodsBuyPanel({
        //     goodsUuid: 'cye0vuh7fgw0lwnx'
        // }).then(() => {
        // console.log('弹出商品购买窗口成功')
        // }).catch(err => {
        //     console.log('弹出商品购买窗口失败：' + err.message)
        // })
    }
    //购买旗袍girl皮肤
    buyGirl = () => {
        //检查主播是否可以使用当前付费模块
        hyExt.revenue.checkStreamerCanUseGoods({
            goodsUuid: 'cye0vuh7uaitjjt8'
        }).then(({ isCanUse }) => {
        hyExt.logger.info('检查成功：' + isCanUse)
        }).catch(err => {
        hyExt.logger.warn('检查失败：' + err.message)
        })
        // hyExt.revenue.popupGoodsBuyPanel({
        //     goodsUuid: 'cye0vuh7uaitjjt8'
        //  }).then(() => {
        //     console.log('弹出商品购买窗口成功')
        //  }).catch(err => {
        //     console.log('弹出商品购买窗口失败：' + err.message)
        //  })
    }
    //购买篮球boy皮肤
    buyBoy = () => {
        //检查主播是否可以使用当前付费模块
        hyExt.revenue.checkStreamerCanUseGoods({
            goodsUuid: 'cye0vuh77id0k4q6'
        }).then(({ isCanUse }) => {
        hyExt.logger.info('检查成功：' + isCanUse)
        }).catch(err => {
        hyExt.logger.warn('检查失败：' + err.message)
        })
        // hyExt.revenue.popupGoodsBuyPanel({
        //     goodsUuid: 'cye0vuh77id0k4q6'
        //  }).then(() => {
        //     console.log('弹出商品购买窗口成功')
        //  }).catch(err => {
        //     console.log('弹出商品购买窗口失败：' + err.message)
        //  })
    }
    //获取虎小牙皮肤有效期
    getTigerDate = () =>{
        hyExt.revenue.checkStreamerGoodsExpire({
            goodsUuid: 'cye0vuh7fgw0lwnx'
         }).then(({expire,hadBuy})=>{
            console.log('获取虎小牙商品有效期成功', expire, hadBuy)
            //获取当前时间戳
            let date = Math.round(new Date() / 1000)
            //没有购买过的情况
            if(expire=="-1"){
                this.setState({
                    myTiger:false
                })
            }else{
                if(date <= Number(expire)){
                    this.setState({
                        myTiger:true
                    })
                }else{
                    this.setState({
                        myTiger:false
                    })
                }
            }
         }).catch(err=>{
            console.log('获取虎小牙商品有效期失败：' + err.message)
         })
    }
    //获取旗袍girl皮肤有效期
    getGirlDate = () =>{
        hyExt.revenue.checkStreamerGoodsExpire({
            goodsUuid: 'cye0vuh7uaitjjt8'
         }).then(({expire,hadBuy})=>{
            console.log('获取旗袍girl商品有效期成功', expire, hadBuy)
            //获取当前时间戳
            let date = Math.round(new Date() / 1000)
            //没有购买过的情况
            if(expire=="-1"){
                this.setState({
                    myGirl:false
                })
            }else{
                if(date <= Number(expire)){
                    this.setState({
                        myGirl:true
                    })
                }else{
                    this.setState({
                        myGirl:false
                    })
                }
            }
         }).catch(err=>{
            console.log('获取旗袍girl商品有效期失败：' + err.message)
         })
    }
    //获取篮球boy皮肤有效期
    getBoyDate = () =>{
        hyExt.revenue.checkStreamerGoodsExpire({
            goodsUuid: 'cye0vuh77id0k4q6'
         }).then(({expire,hadBuy})=>{
            console.log('获取篮球boy商品有效期成功', expire, hadBuy)
            //获取当前时间戳
            let date = Math.round(new Date() / 1000)
            //没有购买过的情况
            if(expire=="-1"){
                this.setState({
                    myBoy:false
                })
            }else{
                if(date <= Number(expire)){
                    this.setState({
                        myBoy:true
                    })
                }else{
                    this.setState({
                        myBoy:false
                    })
                }
            }
         }).catch(err=>{
            console.log('获取篮球boy商品有效期失败：' + err.message)
         })
    }
    //设置小程序简易存储键值对，选择小黄人
    setYellowMan = () =>{
        let args = []
        args[0] = 'goodsUuid'
        args[1] = 'minions'
        console.log('设置小程序简易存储键值对：' + JSON.stringify(args))
        hyExt.storage.setItem(args[0], args[1]).then(() => {
            console.log('设置小程序简易存储键值对成功')    
        }).catch(err => {
            console.log('设置小程序简易存储键值对失败，错误信息：' + err.message)
        })
        this.getStorage()
    }

    //设置小程序简易存储键值对，选择虎小牙
    setTiger = () =>{
        let args = []
        args[0] = 'goodsUuid'
        args[1] = 'cye0vuh7fgw0lwnx'
        console.log('设置小程序简易存储键值对：' + JSON.stringify(args))
        hyExt.storage.setItem(args[0], args[1]).then(() => {
            console.log('设置小程序简易存储键值对成功')    
        }).catch(err => {
            console.log('设置小程序简易存储键值对失败，错误信息：' + err.message)
        })
        this.getStorage()
    }

    //设置小程序简易存储键值对，选择旗袍girl
    setGirl = () =>{
        let args = []
        args[0] = 'goodsUuid'
        args[1] = 'cye0vuh7uaitjjt8'
        console.log('设置小程序简易存储键值对：' + JSON.stringify(args))
        hyExt.storage.setItem(args[0], args[1]).then(() => {
            console.log('设置小程序简易存储键值对成功')    
        }).catch(err => {
            console.log('设置小程序简易存储键值对失败，错误信息：' + err.message)
        })
        this.getStorage()
    }

    //设置小程序简易存储键值对，选择篮球boy
    setBoy = () =>{
        let args = []
        args[0] = 'goodsUuid'
        args[1] = 'cye0vuh77id0k4q6'
        console.log('设置小程序简易存储键值对：' + JSON.stringify(args))
        hyExt.storage.setItem(args[0], args[1]).then(() => {
            console.log('设置小程序简易存储键值对成功')    
        }).catch(err => {
            console.log('设置小程序简易存储键值对失败，错误信息：' + err.message)
        })
        this.getStorage()
    }
    //获取小程序简易存储键值对
    getStorage = () => {
        let args = []
        args[0] = 'goodsUuid'
        console.log('获取小程序简易存储键值对：' + JSON.stringify(args))
        hyExt.storage.getItem(args[0]).then(value => {
            console.log('获取小程序简易存储键值对成功，返回：' + JSON.stringify(value))
            console.log("value------------:"+value)
            switch(value){
                case 'minions':
                    this.setState({
                        choiceYellowMan:true,
                        choiceTiger:false,
                        choiceGirl:false,
                        choiceBoy:false,
                    })
                    break;
                case 'cye0vuh7fgw0lwnx':
                    this.setState({
                        choiceYellowMan:false,
                        choiceTiger:true,
                        choiceGirl:false,
                        choiceBoy:false,
                    })
                    break;
                case 'cye0vuh7uaitjjt8':
                    this.setState({
                        choiceYellowMan:false,
                        choiceTiger:false,
                        choiceGirl:true,
                        choiceBoy:false,
                    })
                    break;
                case 'cye0vuh77id0k4q6':
                    this.setState({
                        choiceYellowMan:false,
                        choiceTiger:false,
                        choiceGirl:false,
                        choiceBoy:true,
                    })
                    break;
                default:
                    this.setState({
                        choiceYellowMan:true,
                        choiceTiger:false,
                        choiceGirl:false,
                        choiceBoy:false,
                    })
                    break;
            }    
        }).catch(err => {
            console.log('获取小程序简易存储键值对失败，错误信息：' + err.message)
        })
    }
    refresh = () =>{
        console.log("刷新")
        this.getTigerDate();
        this.getGirlDate();
        this.getBoyDate();
    }
    componentDidMount() {
        hyExt.onLoad(()=> {
            this.getTigerDate();
            this.getGirlDate();
            this.getBoyDate();
        })
        //每3秒刷新一次商品状态
        myVar = setInterval(this.refresh,3000)
        //获取小程序存储键值对
        this.getStorage()
    }
    componentWillUnmount() {
        clearInterval(myVar)
    }

    render () {
        //判断小黄人选择状态
        let showChoiceYellowMan = this.state.choiceYellowMan ?
            <Image className="choice" src={require("../../assets/choice.png")} />:null;
        //判断虎小牙选择状态
        let showChoiceTiger = this.state.choiceTiger ?
            <Image className="choice" src={require("../../assets/choice.png")} />:null;
        //判断girl选择状态
        let showChoiceGirl = this.state.choiceGirl ?
            <Image className="choice" src={require("../../assets/choice.png")} />:null;
        //判断boy选择状态
        let showChoiceBoy = this.state.choiceBoy ?
        <Image className="choice" src={require("../../assets/choice.png")} />:null;
        //判断虎小牙是否已经购买，呈现界面
        let showTiger = this.state.myTiger ?
            <View className="backdrop" onClick={this.setTiger}>
                <Image className="tiger" src={require("../../assets/decoration/tiger.png")}/>
                <Text className="txt">虎小牙</Text>
                <View>
                    {showChoiceTiger}
                </View>
            </View>
            :
            <View className="backdrop" onClick={() => {
                this._modal_tiger.open()
            }}>
                <Image className="tiger" src={require("../../assets/decoration/tiger.png")} style={{opacity:0.3}}/>
                <Text className="txt">虎小牙</Text>
                <Image className="clocked" src={require("../../assets/locked.png")}/>
            </View>;
        //判断girl是否以购买，呈现界面
        let showGirl = this.state.myGirl ?
            <View className="backdrop" onClick={this.setGirl}>
                <Image className="girl" src={require("../../assets/decoration/girl.png")}/>
                <Text className="txt">旗袍girl</Text>
                <View>
                    {showChoiceGirl}
                </View>
            </View>
            :
            <View className="backdrop" onClick={() => {
                this._modal_girl.open()
            }}>
                <Image className="girl" src={require("../../assets/decoration/girl.png")} style={{opacity:0.3}}/>
                <Text className="txt">旗袍girl</Text>
                <Image className="clocked" src={require("../../assets/locked.png")}/>
            </View>;
        //判断boy是否以购买，呈现界面
        let showBoy = this.state.myBoy ?
            <View className="backdrop" onClick={this.setBoy}>
                <Image className="boy" src={require("../../assets/decoration/boy.png")}/>
                <Text className="txt">篮球boy</Text>
                <View>
                    {showChoiceBoy}
                </View>
            </View>
            :
            <View className="backdrop" onClick={() => {
                this._modal_boy.open()
            }}>
                <Image className="boy" src={require("../../assets/decoration/boy.png")} style={{opacity:0.3}}/>
                <Text className="txt">篮球boy</Text>
                <Image className="clocked" src={require("../../assets/locked.png")}/>
            </View>;
        return (
            <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
                {/*首页图标*/}
                <View style={{
                    flexDirection: "row",
                    height: 40,
                    padding: 20
                }}>
                    <View onClick={this.handleClick}>
                        <Image className="home" src={require('../../assets/home.png')}></Image>
                    </View>
                    <View style={{width:320}}>
                        <Text className="title">选择皮肤</Text>
                    </View>
                    <View style={{width:10}}>
                    </View>
                </View>
                {/*皮肤显示*/}
                <View  className="container">
                    <View style={{
                        flexDirection: "row",
                    }}>
                        <View className="backdrop" onClick={this.setYellowMan}>
                            <Image className="yellowMan" src={require("../../assets/decoration/yellowMan.png")}/>
                            <Text className="txt">小黄人</Text>
                            <View>
                                {showChoiceYellowMan}
                            </View>
                        </View>
                        <View>
                            {showTiger}
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                    }}>
                        <View>
                            {showGirl}
                        </View>
                        <View>
                            {showBoy}
                        </View>  
                    </View>
                </View>
                {/* 虎小牙购买弹窗 */}
                <Modal
                    ref={(c) => { this._modal_tiger = c; }}
                    cancelable={true}
                    style={{
                        flex: 1,
                        marginHorizontal: 70,
                    }}>
                    <BackgroundImage src={require('../../assets/modal1.png')} style={{width:235,height:300}}>
                        <View style={{borderRadius: 20,minWidth: 100, height: 300, alignItems: 'center', justifyContent: 'center'}}>
                            <Image className="buy_tiger" src={require('../../assets/decoration/tiger.png')}></Image>
                            <Text className="txt">虎小牙（未解锁）</Text>
                            <Button className="unlock" size='sm' type="primary" onPress={this.buyTiger}>解锁</Button>
                            <Text className="txt">10虎牙币</Text>
                        </View>
                    </BackgroundImage>
                </Modal>
                {/* 旗袍girl购买弹窗 */}
                <Modal
                    ref={(c) => { this._modal_girl = c; }}
                    cancelable={true}
                    style={{
                        flex: 1,
                        marginHorizontal: 70,
                    }}>
                    <BackgroundImage src={require('../../assets/modal1.png')} style={{width:235,height:300}}>
                        <View style={{borderRadius: 20,minWidth: 100, height: 300, alignItems: 'center', justifyContent: 'center'}}>
                            <Image className="buy_girl" src={require('../../assets/decoration/girl.png')}></Image>
                            <Text className="txt">旗袍girl（未解锁）</Text>
                            <Button className="unlock" size='sm' type="primary" onPress={this.buyGirl}>解锁</Button>
                            <Text className="txt">10虎牙币</Text>
                        </View>
                    </BackgroundImage>
                </Modal>
                {/* 篮球boy购买弹窗 */}
                <Modal
                    ref={(c) => { this._modal_boy = c; }}
                    cancelable={true}
                    style={{
                        flex: 1,
                        marginHorizontal: 70,
                    }}>
                    <BackgroundImage src={require('../../assets/modal1.png')} style={{width:235,height:300}}>
                        <View style={{borderRadius: 20,minWidth: 100, height: 300, alignItems: 'center', justifyContent: 'center'}}>
                            <Image className="buy_boy" src={require('../../assets/decoration/boy.png')}></Image>
                            <Text className="txt">篮球boy（未解锁）</Text>
                            <Button className="unlock" size='sm' type="primary" onPress={this.buyBoy}>解锁</Button>
                            <Text className="txt">10虎牙币</Text>
                        </View>
                    </BackgroundImage>
                </Modal>
            </BackgroundImage>
        )
    }
}

export default Shop