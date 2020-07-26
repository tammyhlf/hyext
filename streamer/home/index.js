import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'


const { View, Button, Text, Icon, Image, BackgroundImage} = UI
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {

    };
  }
  componentWillMount() {

  }
  componentDidMount() {

  }

  handleClick = () => {
    this.props.history.push('/add')
  }
  handleClick1 = () => {
    this.props.history.push('/create')
  }
  handleClick2 = () => {
    this.props.history.push('/record')
  }


  render () {
    return (
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        <View className="container">
          <Image className="groupImage" src={require('../../assets/group-image.png')}/>
            <Button className="setup"  type="primary" onPress={this.handleClick1}>创建房间</Button>
            <Button className="add" type="primary" onPress={this.handleClick}>加入房间</Button>
            <Text className="txt" onPress={this.handleClick2}>历史战绩<Icon type='angle-right' size={10} tintColor='#ffffff'></Icon></Text>
        </View>
      </BackgroundImage>
    )
  }
}

export default Home