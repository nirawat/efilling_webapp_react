import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../../../Layout/index';
import Home from '../../../Form/Home/index';
import Home1 from '../../../Form/Home1/index';
import BookingDashboard from '../../../Dashboards/Booking/index';
import Account from './Account';

import MenuA1 from '../../../Form/MenuA/MenuA1/index';
import MenuA1Edit from '../../../Form/MenuA/MenuA1_Edit/index';
import MenuA2 from '../../../Form/MenuA/MenuA2/index';
import MenuA3 from '../../../Form/MenuA/MenuA3/index';
import MenuA4 from '../../../Form/MenuA/MenuA4/index';
import MenuA5 from '../../../Form/MenuA/MenuA5/index';
import MenuA6 from '../../../Form/MenuA/MenuA6/index';
import MenuA7 from '../../../Form/MenuA/MenuA7/index';
import MenuA8 from '../../../Form/MenuA/MenuA8/index';

import MenuB1 from '../../../Form/MenuB/MenuB1/index';
import MenuB1Edit from '../../../Form/MenuB/MenuB1_Edit/index';
import MenuB2 from '../../../Form/MenuB/MenuB2/index';

import MenuC1 from '../../../Form/MenuC/MenuC1/index';
import MenuC1Edit from '../../../Form/MenuC/MenuC1_Edit/index';
import MenuC12 from '../../../Form/MenuC/MenuC1_2/index';
import MenuC2 from '../../../Form/MenuC/MenuC2/index';
import MenuC2Edit from '../../../Form/MenuC/MenuC2_Edit/index';
import MenuC22 from '../../../Form/MenuC/MenuC2_2/index';
import MenuC3 from '../../../Form/MenuC/MenuC3/index';
import MenuC31 from '../../../Form/MenuC/MenuC3_1/index';
import MenuC32 from '../../../Form/MenuC/MenuC3_2/index';
import MenuC33 from '../../../Form/MenuC/MenuC3_3/index';
import MenuC34 from '../../../Form/MenuC/MenuC3_4/index';
import MenuC35 from '../../../Form/MenuC/MenuC3_5/index';
import MenuC3Report from '../../../Form/MenuC/MenuC3_Report/index';

import MenuD1 from '../../../Form/MenuD/MenuD1/index';
import MenuD2 from '../../../Form/MenuD/MenuD2/index';

import MenuF1 from '../../../Form/MenuF/MenuF1/index';
import MenuF1Edit from '../../../Form/MenuF/MenuF1_Edit/index';
import MenuF2 from '../../../Form/MenuF/MenuF2/index';

import ErrorPermission from '../../../Form/Errors/Permissoin/index';

export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route path="/forms/home" component={Home} />
      <Route path="/forms/home1" component={Home1} />
      <Route path="/dashboard_booking" component={BookingDashboard} />
      <Route path="/account" component={Account} />
      <Route path="/forms/menuA/menuA1" component={MenuA1} />
      <Route path="/forms/menuA/menuA1_Edit" component={MenuA1Edit} />
      <Route path="/forms/menuA/menuA2" component={MenuA2} />
      <Route path="/forms/menuA/menuA3" component={MenuA3} />
      <Route path="/forms/menuA/menuA4" component={MenuA4} />
      <Route path="/forms/menuA/menuA5" component={MenuA5} />
      <Route path="/forms/menuA/menuA6" component={MenuA6} />
      <Route path="/forms/menuA/menuA7" component={MenuA7} />
      <Route path="/forms/menuA/menuA8" component={MenuA8} />
      <Route path="/forms/menuB/menuB1" component={MenuB1} />
      <Route path="/forms/menuB/menuB1_Edit" component={MenuB1Edit} />
      <Route path="/forms/menuB/menuB2" component={MenuB2} />
      <Route path="/forms/menuC/menuC1" component={MenuC1} />
      <Route path="/forms/menuC/menuC1_Edit" component={MenuC1Edit} />
      <Route path="/forms/menuC/menuC1_2" component={MenuC12} />
      <Route path="/forms/menuC/menuC2" component={MenuC2} />
      <Route path="/forms/menuC/menuC2_Edit" component={MenuC2Edit} />
      <Route path="/forms/menuC/menuC2_2" component={MenuC22} />
      <Route path="/forms/menuC/menuC3" component={MenuC3} />
      <Route path="/forms/menuC/menuC3_1" component={MenuC31} />
      <Route path="/forms/menuC/menuC3_2" component={MenuC32} />
      <Route path="/forms/menuC/menuC3_3" component={MenuC33} />
      <Route path="/forms/menuC/menuC3_4" component={MenuC34} />
      <Route path="/forms/menuC/menuC3_5" component={MenuC35} />
      <Route path="/forms/menuC/menuC3_Report" component={MenuC3Report} />
      <Route path="/forms/menuD/menuD1" component={MenuD1} />
      <Route path="/forms/menuD/menuD2" component={MenuD2} />
      <Route path="/forms/menuF/menuF1" component={MenuF1} />
      <Route path="/forms/menuF/menuF1_Edit" component={MenuF1Edit} />
      <Route path="/forms/menuF/menuF2" component={MenuF2} />
      <Route path="/forms/Errors/Permission" component={ErrorPermission} />
    </div>
  </div>
);
