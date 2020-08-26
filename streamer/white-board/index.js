import React, { Component } from "react";
import Board from "./components/board"
import SingleBoard from "./components/single-board";

export default class WhiteBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skin: 'minions',
      resultObj: {},
      singleModel: ''
    };
  }

  componentDidMount() {
    // 监听从原来小程序发送过来的独立白板数据
    hyExt.stream.onExtraWhiteBoardMessage({
      // 接收到数据，刷新视图
      callback: (data) => {
        const resultObj = JSON.parse(data);
        if (resultObj.singleModel == 'single' && resultObj.goods) {
          this.setState({singleModel: resultObj.singleModel, skin: resultObj.skin})
        } else if (resultObj.goods) {
          this.setState({ skin: resultObj.skin })
        } else {
          this.setState({ resultObj });
        }
      },
    }).then(() => {
      console.log('监听小程序独立白板消息成功')    
    }).catch(err => {
      console.log('监听小程序独立白板消息失败，错误信息：' + err.message)
    })
  }

  renderBoard() {
    return <Board resultObj={this.state.resultObj} skin={this.state.skin} />
  }
  renderSingle() {
    return <SingleBoard resultObj={this.state.resultObj} skin={this.state.skin} />
  }

  render () {
    if(this.state.singleModel == 'single'){
      return this.renderSingle();
    }else
      return this.renderBoard();
  }
}
