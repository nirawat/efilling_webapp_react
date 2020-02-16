import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Profile from '../../../Account/Profile/index';
import ResetPass from '../../../Account/ResetPass/index';

export default () => (
  <Switch>
    <Route path="/account/profile" component={Profile} />
    <Route path="/account/resetPass" component={ResetPass} />
  </Switch>
);
