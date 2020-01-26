import React from 'react';
import TopbarNavDashboards from './TopbarNavDashboards';
import TopbarNavUIElements from './TopbarNavUIElements';
import TopbarNavOtherPages from './TopbarNavOtherPages';

const TopbarNav = () => (
  <nav className="topbar__nav">
    <TopbarNavDashboards />
    <TopbarNavUIElements />
    <TopbarNavOtherPages />
  </nav>
);

export default TopbarNav;
