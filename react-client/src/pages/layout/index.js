
import React, { Component } from 'react'
import { Route,Switch,withRouter  } from 'react-router-dom'
import LayoutMain from '../../component/layout/index'
import  {allRouter,AsyncError} from '../../router'
import AuthRouter  from './authRouter'
import { connect } from 'react-redux';

export class App extends Component {

  // 判断是否登录
  componentWillReceiveProps(nextProps) {
      this.isLogin();
 }
 
  componentDidMount(){
    this.isLogin();
  }
  isLogin(){
    var {history:{replace},app_token} = this.props;
    // var token = sessionStorage.getItem("APP_TOKEN");
    if(!app_token){
      replace("/login")
    }
 }
  render() {
 
    return (
      <LayoutMain>
         <Switch>
             {
              allRouter.map(itme=>{
                return  <Route 
                  key={itme.path} 
                  path={itme.path}
                  exact
                  render={(props) => {
                         return <AuthRouter   {...props} route={itme}/>
                      // return <itme.component {...props} route={itme}/>
                    }}
                  />
               
              //  return <Route key={itme.path} exact {...itme} />
              })
             }
            <Route  component={AsyncError} />
         
        </Switch> 
        </LayoutMain> 
      //  </AppContext.Provider>
    )
  }
}
export default connect(
  state=>({
     app_token:state.AppToken
  })
)(withRouter(App))
// export default withRouter(App)

