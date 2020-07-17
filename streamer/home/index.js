import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'

const { View, Button, Text, Badge, Icon, Image, BackgroundImage} = UI

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mytext : "",
    };
  }
  getData= () =>{ //请求数据函数
    fetch(`http://localhost:3000/messages/1`,{
      method: 'GET'
    }).then(res => res.json()).then(
        data => {
          this.setState({mytext:data})
        }
    )
  }

  componentWillMount() {
    this.getData()
  }

  handleClick = () => {
    this.props.history.push('/add')
  }
  handleClick1 = () => {
    this.props.history.push('/create')
  }
  render () {
    return (
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        <View className="container">
          <Image className="groupImage" src={require('../../assets/group-image.png')}/>
          <Button className="setup" onPress={this.handleClick1} >创建房间</Button>
          <Button className="add" onPress={this.handleClick}>加入房间</Button>
          <Text>邀请对战信息<Badge label={this.state.mytext.data}/><Icon type='angle-right' size={14} tintColor='#000000'></Icon></Text>
        </View>
      </BackgroundImage>
    )
  }
}

export default Home