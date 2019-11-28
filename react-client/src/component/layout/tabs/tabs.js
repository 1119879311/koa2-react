import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Tabs } from 'antd';
import {allRouter} from '../../../router'
const { TabPane } = Tabs;
var entryIndex = 0;
class layoutTabs extends Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [
      { title: '首页', content: 'Content of Tab 1', key: '/admin', closable: false, },
    ];
    this.state = {
      activeKey: panes[0].key,
      panes,
    };
  }
  // 在路由中找一个tabs
  filterRouter(path){
    var pathItme = allRouter.filter(itme=>itme.path.toLowerCase()===path.toLowerCase());
    return pathItme[0]?pathItme[0]:""
  }
  //判断下一个路由是否在tabs 中
  isRouteTabs(key){
    var pathItme = this.state.panes.filter(itme=>itme.key.toLowerCase()===key.toLowerCase());
    return pathItme[0]?true:false
  }
  setTabs = (pathname)=>{
    if(!this.isRouteTabs(pathname)){//不存在tabs 
      var tabItem = this.filterRouter(pathname);
      if(tabItem){ //存在route ,加入新一个tabs
        this.addTabs(tabItem)
      }else{

        this.setState({ activeKey:"-1" }); //去掉激活的
      }
    }else{ //如果存在，则要激活
      
      this.setState({  activeKey:pathname });
    }
  }
  //路由变化时判断
  componentWillReceiveProps(nextProps){
    //先判断是否在tabs；在不处理，不在则在路由中找出加入
    if(entryIndex){
      entryIndex = null;
    }else{
      var {pathname} = nextProps.location 
      this.setTabs(pathname)
    }
   
 }
//  初始化时
  componentDidMount(){
    // var {pathname} = this.props.location
    var {history:{replace}} = this.props;
    entryIndex = 1;
    var pathname = "/admin";//重置为主界面
    this.setTabs(pathname)
    replace(pathname)
  }
  addTabs = item=>{
    const { panes } = this.state;
    const activeKey =item.path.toLowerCase();
    panes.push({ title:item.title, content: '', key: activeKey });
    this.setState({ panes, activeKey });
  }
  onChange = activeKey => {
    this.setState({ activeKey });
    var {history:{replace}} = this.props;
    replace(activeKey)
  };

  onEdit = (targetKey, action) => {
   
    this[action](targetKey);
  };

  add = () => {};

  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
    var {history:{replace}} = this.props;
    replace(activeKey)
  };

  render() {
    return (
      <Tabs
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {this.state.panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {/* {pane.content} */}
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default withRouter(layoutTabs)
