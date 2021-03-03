import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppContext } from '../../data/app-context';

class AuthorizedRoute extends Route {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;
  render(): React.ReactNode {
    if (!this.context?.token) return <Redirect to="/login" />;
    else return super.render();
  }
}

export default AuthorizedRoute;
