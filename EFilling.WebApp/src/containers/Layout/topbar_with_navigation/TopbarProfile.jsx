import React, { PureComponent } from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';

const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

export default class TopbarProfile extends PureComponent {
  constructor() {
    super();
    this.state = {
      collapse: false,
    };
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  render() {
    const { collapse } = this.state;

    return (
      <div className="topbar__profile">
        <button className="topbar__avatar" type="button" onClick={this.toggle}>
          <img className="topbar__avatar-img" src={Ava} alt="avatar" />
          <p className="topbar__avatar-name">Nirawat P.</p>
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && <button className="topbar__back" type="button" onClick={this.toggle} />}
        <Collapse isOpen={collapse} className="topbar__menu-wrap">
          <div className="topbar__menu">
            <TopbarMenuLink
              title="ข้อมูลผู้ใช้ระบบ"
              icon="user"
              path="/account/profile"
              onClick={this.toggle}
            />
            <div className="topbar__menu-divider" />
            <TopbarMenuLink
              title="ตั้งค่าบัญชี"
              icon="cog"
              path="/account/profile"
              onClick={this.toggle}
            />
            <TopbarMenuLink
              title="ล๊อคหน้าจอ"
              icon="lock"
              path="/lock_screen"
              onClick={this.toggle}
            />
            <TopbarMenuLink
              title="ออกจากระบบ"
              icon="exit"
              path="/log_in"
              onClick={this.toggle}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}
