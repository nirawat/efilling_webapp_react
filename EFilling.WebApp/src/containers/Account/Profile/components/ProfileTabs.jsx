import React, { PureComponent } from 'react';
import {
  Card, Col, Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import showResults from './Show';
import ProfileSettings1 from './ProfileSettings1';
import ProfileSettings2 from './ProfileSettings2';
import ProfileSettings3 from './ProfileSettings3';
import ProfileSettings4 from './ProfileSettings4';
import ProfileSettings5 from './ProfileSettings5';

export default class ProfileTabs extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
    };
  }

  toggle(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const initialValues = {
      username: 'Larry Boom',
      email: 'boom@mail.com',
    };

    const { activeTab } = this.state;
    return (
      <Col md={12} lg={12} xl={8}>
        <Card>
          <div className="profile__card tabs tabs--bordered-bottom">
            <div className="tabs__wrap">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => {
                      this.toggle('1');
                    }}
                  >
                    ประวัติส่วนตัว
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => {
                      this.toggle('2');
                    }}
                  >
                    ประวัติการศึกษา
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '3' })}
                    onClick={() => {
                      this.toggle('3');
                    }}
                  >
                    ประสบการณ์การทำงาน (ประจำ)
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '4' })}
                    onClick={() => {
                      this.toggle('4');
                    }}
                  >
                    ประสบการณ์และผลงานในการเป็นที่ปรึกษา
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '5' })}
                    onClick={() => {
                      this.toggle('5');
                    }}
                  >
                    อื่นๆ
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <ProfileSettings1 onSubmit={showResults} initialValues={initialValues} />
                </TabPane>
                <TabPane tabId="2">
                  <ProfileSettings2 onSubmit={showResults} initialValues={initialValues} />
                </TabPane>
                <TabPane tabId="3">
                  <ProfileSettings3 onSubmit={showResults} initialValues={initialValues} />
                </TabPane>
                <TabPane tabId="4">
                  <ProfileSettings4 onSubmit={showResults} initialValues={initialValues} />
                </TabPane>
                <TabPane tabId="5">
                  <ProfileSettings5 onSubmit={showResults} initialValues={initialValues} />
                </TabPane>
              </TabContent>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}
