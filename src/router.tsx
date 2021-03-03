import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import AuthorizedRoute from './components/Navigation/AuthorizedRoute';
import NavBar from './components/Navigation/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Startup from './pages/Startup';

const AppRouter: React.FC = (props) => {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/" component={Startup} exact />
          <Route path="/signup" component={Signup} exact />
          <Route path="/login" component={Login} exact />
          <AuthorizedRoute path="/home" component={Home} exact />
          <AuthorizedRoute path="/profile" component={Profile} exact />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
