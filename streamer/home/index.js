import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import {Link} from "react-router-dom";


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

  // handleClick = () => {
  //   this.props.history.push('/add')
  // }
  // handleClick1 = () => {
  //   this.props.history.push('/create')
  // }

  render () {
    return (
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        <View className="container">
          <Image className="groupImage" src={require('../../assets/group-image.png')}/>
          <Link to={'/create'}>
            <Button className="setup"  type="primary">创建房间</Button>
          </Link>

          <Link to={'/add'}>
            <Button className="add" type="primary">加入房间</Button>
          </Link>

          <Link to={'/record'}>
            <Text className="txt">历史战绩<Icon type='angle-right' size={10} tintColor='#ffffff'></Icon></Text>
          </Link>
        </View>
      </BackgroundImage>
    )
  }
}

export default Home