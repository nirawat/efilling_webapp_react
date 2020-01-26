import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainWrapper from '../MainWrapper';
import NotFound404 from '../../DefaultPage/404/index';
import NotFound404Permission from '../../DefaultPage/404_Permission/index';
import LockScreen from '../../Account/LockScreen/index';
import LogIn from '../../Account/LogIn/index';
import Register from '../../Account/Register/index';
import RegisterActive from '../../Account/RegisterActive/index';
import RegisterComplete from '../../Account/RegisterComplete/index';
import PagesE1 from '../../Form/MenuE/MenuE1/index';
import WrappedRoutes from './WrappedRoutes';

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/" component={LogIn} />
        <Route path="/404" component={NotFound404} />
        <Route path="/404Permission" component={NotFound404Permission} />
        <Route path="/lock_screen" component={LockScreen} />
        <Route path="/log_in" component={LogIn} />
        <Route path="/register" component={Register} />
        <Route path="/registerActive" component={RegisterActive} />
        <Route path="/registerComplete" component={RegisterComplete} />
        <Route path="/MenuE1" component={PagesE1} />
        <Route path="/" component={WrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
