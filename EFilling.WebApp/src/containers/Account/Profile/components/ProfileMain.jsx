import React from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';

const Ava = `${process.env.PUBLIC_URL}/img/12.png`;

const ProfileMain = () => (
  <Col md={12} lg={12} xl={12}>
    <Card>
      <CardBody className="profile__card">
        <div className="profile__information">
          <div className="profile__avatar">
            <img src={Ava} alt="avatar" />
          </div>
          <div className="profile__data">
            <p className="profile__name">Larry Boom</p>
            <p className="profile__work">Senior Account Manager</p>
            <p className="profile__contact">mailmethisletter@gmail.com</p>
            <p className="profile__contact" dir="ltr">+66 83 309 4692</p>
          </div>
        </div>
        <div className="profile__stats">
          <div className="profile__stat">
            <p className="profile__stat-number">0</p>
            <p className="profile__stat-title">โครงการ</p>
          </div>
          <div className="profile__stat">
            <p className="profile__stat-number">0</p>
            <p className="profile__stat-title">ผลงาน</p>
          </div>
          <div className="profile__stat">
            <p className="profile__stat-number">0</p>
            <p className="profile__stat-title">ประสบการณ์ (ปี)</p>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>
);

export default ProfileMain;
