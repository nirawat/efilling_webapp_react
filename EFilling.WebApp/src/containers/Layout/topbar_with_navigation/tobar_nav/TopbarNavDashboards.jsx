import React from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {
  DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown,
} from 'reactstrap';
import TopbarNavLink from './TopbarNavLink';

const TopbarNavDashboards = () => (
  <UncontrolledDropdown className="topbar__nav-dropdown">
    <DropdownToggle className="topbar__nav-dropdown-toggle">
      Dashboards <DownIcon />
    </DropdownToggle>
    <DropdownMenu className="topbar__nav-dropdown-menu dropdown__menu">
      <DropdownItem>
        <TopbarNavLink title="Dashboard Default" icon="home" route="/dashboard_default" />
      </DropdownItem>
      <DropdownItem>
        <TopbarNavLink title="Dashboard Booking" icon="apartment" newLink route="/dashboard_booking" />
      </DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
);


export default TopbarNavDashboards;
