import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'

const { View, Text } = UI

class LuckDraw extends Component {
  render () {
    return (
      <View className="container"><Text>hello luckDraw</Text></View>
    )
  }
}

export default LuckDraw

