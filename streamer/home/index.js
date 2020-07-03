import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import { Link } from 'react-router-dom';

const { View, Text } = UI

class Home extends Component {
  render () {
    return (
      <View>
        <Link to="/luck-draw">跳转到抽奖</Link>
      </View>
    )
  }
}

export default Home