import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import {Link} from "react-router-dom";

const { View, Text, Longlist, Image, BackgroundImage} = UI

class Record extends Component {

    constructor (p) {
        super(p)
        this.state = {
        }
    }

    componentWillMount() {

    }


    render () {
        return (
            <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
                {/*首页图标*/}
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
                    <View style={{width:320}}>
                    </View>
                </View>
                <View  className="container">
                    <Image className="logo" src={require('../../assets/logo.png')}/>
                    <Longlist
                        ref={(c) => {
                        }}

                        renderItem={({ item, index }) => {
                            return (
                                <View
                                    style={{
                                        marginBottom: 12,
                                        paddingVertical: 30,
                                        paddingHorizontal: variables.hyHSpacingXL,
                                        backgroundColor: '#fff'
                                    }}>
                                </View>
                            )
                        }}
                    />
                </View>
            </BackgroundImage>
        )
    }
}

export default Record