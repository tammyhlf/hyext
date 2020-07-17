import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import {Link} from "react-router-dom";

const { View, Text, Input ,Button ,BackgroundImage ,Image ,Icon} = UI

class Add extends Component {
    constructor (p) {
        super(p)
        this.state = {
        }
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

                    {/*<View style={{*/}
                    {/*    flexDirection: "row",*/}
                    {/*    height: 150,*/}
                    {/*    padding: 50*/}
                    {/*}}>*/}
                    {/*    <View>*/}
                    {/*        <Image className="user1" src={require('../../assets/blue-avatar-bgd.png')}/>*/}
                    {/*    </View>*/}
                    {/*    <View>*/}
                    {/*        <Image className="spack-left" src={require('../../assets/spark-left.png')}/>*/}
                    {/*</View>*/}
                    {/*<View>*/}
                    {/*    <Image className="spack-right" src={require('../../assets/spark-right.png')}/>*/}
                    {/*</View>*/}
                    {/*    <View>*/}
                    {/*        <Image className="user2" src={require('../../assets/yellow-avatar-bgd.png')}/>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                    {/*<View  className="pk" style={{*/}
                    {/*    flex:1,*/}
                    {/*    flexDirection: "row",*/}
                    {/*}}>*/}
                    {/*    <View>*/}
                    {/*        <Image className="blue-avatar" src={require('../../assets/blue-avatar.png')}/>*/}
                    {/*    </View>*/}
                    {/*    <View>*/}
                    {/*        <Image className="yellow-avatar" src={require('../../assets/yellow-avatar.png')}/>*/}
                    {/*    </View>*/}
                    {/*</View>*/}

                    <Text className="txt">输入房间号码:</Text>
                    <Input
                        style={{ margin: 13,borderRadius:150}}
                        inputStyle={{}}
                        textAlign='center'
                        value={this.state.roomNum}
                        placeholder='请输入房间号'
                        maxLength={6}
                        onChange={(value) => {
                            this.setState({
                                roomNum: value
                            })
                        }}
                    />
                </View>
            </BackgroundImage>
        )
    }
}
export default Add