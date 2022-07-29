import React, { Component } from 'react';
import { Router, Stack, Scene, Actions} from 'react-native-router-flux';

import LogIn from './LogIn';
import SignUp from './SignUp';
import BottomTab from './BottomTab'

/* export default class Routes extends Component {
    render() {
        return( 
            <Router>
              <Stack key="root" hideNavBar = {true}>
                <Scene key="login" component={LogIn} title="Login" initial = {true} />
                <Scene key="signup" component={SignUp} title="Signup"/>
                <Scene key="mainpage" component={BottomTab} title="Main"/>
              </Stack>
            </Router>
        )
    }
} */

const Routes = () => {
    return (
      <Router>
        <Scene key="root" hideNavBar>
            <Scene key="login" component={LogIn} title="Login" initial = {true} />
            <Scene key="signup" component={SignUp} title="Signup"/>
            <Scene key="mainpage" component={BottomTab} title="Main"/>
        </Scene>
      </Router>
    );
}
  
export default Routes;