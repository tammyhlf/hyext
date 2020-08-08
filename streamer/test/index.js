import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import { RootContext } from '../context'


const { View,Text,Button,BackgroundImage,Image,Avatar,Tip,Modal} = UI

class Test extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
        };
    }

    static contextType = RootContext

    componentDidMount() {
        let that = this
        hyExt.onLoad(() => {
            if (!this.context.user) {
                this.props.func.requestUserInfo().then(res => {
                    that.setState({
                        userInfo: res.user
                    })
                    console.log("----------->打印主播号" + this.state.userInfo.streamerUnionId)
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
        //监听完成信息
        args[0] = 'finish'
        args[1] = data => {
            console.log("----------->返回数据" + data)
        }
        hyExt.observer.on(args[0], args[1])
    }
    render() {
        return(
            <Text>监听数据界面</Text>
        )
    }
}
export default Test