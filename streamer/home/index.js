import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'
import WhiteBoard from '../white-board'

const { View, Button, Text, Icon, Image, BackgroundImage} = UI
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      model: ''
    };
  }

  componentDidMount() {
    let that = this
    if (!this.context.user) {
      this.props.func.requestUserInfo().then(res => {
        that.setState({
          userInfo: res.user
        })
        console.log("----------->打印主播号"+this.state.userInfo.streamerUnionId)
      })
    } else {
      that.setState({
        userInfo: that.context.user
      })
    }
    global.hyExt.env.getInitialParam().then(param => {
      console.log(JSON.stringify(param))
      this.setState({
        path: param.wb ? 'wb' : ''
      })
    })
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
  handleSingle = () => {
    this.props.history.push('/single-dance')
  }
  handlePkModel = () => {
    this.setState({
      model: 'pk'
    })
  }

  renderHome () {
    const { model } = this.state
    return (
      <BackgroundImage className="backgroundImage" src={require('../../assets/background.png')}>
        <View className="container">
          <Image className="groupImage" src={require('../../assets/group-image.png')}/>
            {
              model == 'pk' ? 
              (<><Button className="setup"  type="primary" onPress={this.handleClick1}>创建房间</Button>
              <Button className="add" type="primary" onPress={this.handleClick}>加入房间</Button></>) :
              (<><Button className="setup" type="primary" onPress={this.handlePkModel}>PK模式</Button>
              <Button className="add" type="primary" onPress={this.handleSingle}>单人模式</Button></>)
            }
            {/*<Text className="txt" onPress={this.handleClick2}>历史战绩<Icon type='angle-right' size={10} tintColor='#ffffff'></Icon></Text>*/}
        </View>
      </BackgroundImage>
    )
  }

  render () {
    const { path } = this.state
    if (path === '') {
      return this.renderHome()
    } else if (path === 'wb') {
      return <WhiteBoard />
    }
  }
}

export default Home