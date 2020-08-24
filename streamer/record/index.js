import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import { Route, Router } from "@hyext/router";
import Single from "./single"
import Double from './double';

const { View, Text, Image, BackgroundImage, Tab} = UI

class Record extends Component {
    constructor (p) {
        super(p)
        this.state = {
            single:true,
            double:false,
        }
    }

    handleClick = () => {
        this.props.history.push('/index_streamer_pc_anchor_panel.html')
    }
    handleSingle = () => {
        this.$router.history.replace('/single')
        this.setState({
            single:true,
            double:false,
        })
    }
    handleDouble = () => {
        this.$router.history.replace('/double')
        this.setState({
            single:false,
            double:true,
        })
    }
    componentWillMount() {

    }


    render () {
        //选择状态显示下划线
        let showChoiceSingle = this.state.single ?
            <View className="underLine"></View> : null
        let showChoiceDouble = this.state.double ?
            <View className="underLine"></View> : null
        return (
            <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
                {/*首页图标*/}
                <View style={{
                    flexDirection: "row",
                    height: 40,
                    padding: 20
                }}>
                    <View style={{width:10}} onClick={this.handleClick}>
                        <Image className="home" src={require('../../assets/home.png')}></Image>
                    </View>
                    <View style={{width:320}}>
                    </View>
                </View>
                <View  className="container">
                     {/*<Image className="logo" src={require('../../assets/logo.png')}/>*/}
                    <Text className="txt">战绩纪录</Text>
                    <View style={{
                        flexDirection: "row",
                        height: 40,
                        padding: 20
                    }}>
                        <View onClick={this.handleSingle} style={{width:200}}>
                            <Text className="txt">单人模式</Text>
                            {showChoiceSingle}
                        </View>
                        <View onClick={this.handleDouble}>
                            <Text className="txt">双人模式</Text>
                            {showChoiceDouble}
                        </View>
                    </View>
                    <View style={{paddingTop:20}}>
                        <Router initialEntries={['/single']} ref={c => { this.$router = c }}>
                            <Route path={'/single'} render={ (props) => <Single {...props} />}></Route>
                            <Route path={'/double'} render={ (props) => <Double {...props} />}></Route>
                        </Router>
                    </View>
                </View>
            </BackgroundImage>
        )
    }
}

export default Record