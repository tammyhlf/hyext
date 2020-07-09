import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'

const { View, Button } = UI

class Punishment extends Component {
  constructor(props) {
    super(props)
  }
  
  handleClick = () => {
    this.props.history.push('/punishment-draw')
  }

  handleCustomClick = () => {
    this.props.history.push('/game-result')
  }

  render () {
    return (
      <View class="punishment-contanier">
        <Button onPress={this.handleClick}>抽取惩罚</Button>
        <Button onPress={this.handleCustomClick}>自定义惩罚</Button>
      </View>
    )
  }
}

export default Punishment