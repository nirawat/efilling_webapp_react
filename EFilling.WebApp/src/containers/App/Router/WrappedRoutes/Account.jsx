import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Profile from '../../../Account/Profile/index';

export default () => (
  <Switch>
    <Route path="/account/profile" component={Profile} />
  </Switch>
);
