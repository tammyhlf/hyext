import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'

const { View, Button } = UI

class Home extends Component {
  constructor(props) {
    super(props)
  }
  
  handleClick = () => {
    this.props.history.push('/luck-draw')
  }

  render () {
    return (
      <View>
        <Button onPress={this.handleClick}>跳转到抽奖</Button>
      </View>
    )
  }
}

export default Home