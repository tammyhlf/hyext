import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './single.hycss'

const { View, Text, Image, BackgroundImage, Tab} = UI

class Double extends Component {
    constructor (p) {
        super(p)
        this.state = {}
    }

    render () {
        return (
            <View>
                <Text>双人模式记录</Text>
                {/*<BackgroundImage className="backgroundImage" src={require('../../assets/modal1.png')}>*/}
                {/*</BackgroundImage>*/}
            </View>
        )
    }
}

export default Double