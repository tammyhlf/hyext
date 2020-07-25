import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import {Link} from "react-router-dom";
// 引入小程序sdk
const hyExt = global.hyExt
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
    hyExt.onLoad(()=> {    //小程序生命周期
      hyExt.context.getStreamerInfo().then(userInfo => {    //获取用户信息
        console.log(userInfo,"获取主播信息");
      })
    });
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
          <Button className="setup"  type="primary" onPress={this.handleClick1} >创建房间</Button>
          <Button className="add" type="primary" onPress={this.handleClick}>加入房间</Button>
          <Link to={'/record'}>
            <Text className="txt">历史战绩<Icon type='angle-right' size={10} tintColor='#ffffff'></Icon></Text>
          </Link>
        </View>
      </BackgroundImage>
    )
  }
}

export default Home