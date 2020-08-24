import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './single.hycss'

const { View, Text, Image, BackgroundImage, Tab, Longlist} = UI
const dataModal = {
    total: 10,
}
class Single extends Component {
    constructor (p) {
        super(p)
        this.state = {
        }
    }

    render () {
        return (
            <View>
                <BackgroundImage className="backgroundImage" src={require('../../assets/modal1.png')}>
                    <Longlist
                        ref={(c) => {
                            this._longlist = c
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View
                                    style={{
                                        marginBottom: 12,
                                        paddingVertical: 30,
                                        // paddingHorizontal: variables.hyHSpacingXL,
                                        backgroundColor: '#fff'
                                    }}>
                                    <Text style={{ color: variables.hyGrayBase }}>{item.label}</Text>
                                </View>
                            )
                        }}
                        // onEndReached={() => {}}
                        // onRefresh={() => {}}
                    />
                </BackgroundImage>
            </View>
        )
    }
}

export default Single