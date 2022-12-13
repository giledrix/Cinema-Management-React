import { Switch, Route } from 'react-router-dom'

import Login_Comp from './Login'
import Register_Comp from './Register';
import MenuContainer_Comp from './MenuContainer';

function MainContainer_Comp() {
  return (
    <div>

      <Switch>
        <Route exact path="/" component={Login_Comp} />
        <Route path="/register" component={Register_Comp} />
        <Route path="/menu" component={MenuContainer_Comp} />
      </Switch>

    </div>
  );
}

export default MainContainer_Comp;