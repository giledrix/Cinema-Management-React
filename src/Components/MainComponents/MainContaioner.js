import { Switch, Route } from 'react-router-dom'

import Login_Comp from './Login'
import Register_Comp from './Register';
import MenuContainer_Comp from './MenuContainer';
import Home_Comp from './Home';

function MainContainer_Comp() {
  return (
    <div>

      <Switch>
        <Route exact path="/" component={Login_Comp} />
        <Route path="/register" component={Register_Comp} />
        <Route path="/menu" component={MenuContainer_Comp} />
        <Route path="/menu/home" component={Home_Comp} />
      </Switch>

    </div>
  );
}

export default MainContainer_Comp;