import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import ProfileMain from './components/ProfileMain';
import ProfileTasks from './components/ProfileTasks';

const Calendar = () => (
  <Container>
    <div className="profile">
      <Row>
        <Col md={12} lg={12} xl={4}>
          <Row>
            <ProfileMain />
            <ProfileTasks />
          </Row>
        </Col>
      </Row>
    </div>
  </Container>
);

export default Calendar;
