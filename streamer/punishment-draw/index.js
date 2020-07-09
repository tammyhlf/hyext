import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'

const { View, Button } = UI

class Punishment extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <View>
        <Button>我是惩罚</Button>
      </View>
    )
  }
}

export default Punishment