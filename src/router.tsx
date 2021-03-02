import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import NavBar from './components/Navigation/Navbar';
import MainContainer from './components/UiContainers/MainContainer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

interface AppRouterProps {}
const AppRouter: React.FC<AppRouterProps> = (props) => {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <MainContainer>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/signup" component={Signup} exact />
            <Route path="/login" component={Login} exact />
            <Redirect to="/" />
          </Switch>
        </MainContainer>
      </div>
    </Router>
  );
};

export default AppRouter;
