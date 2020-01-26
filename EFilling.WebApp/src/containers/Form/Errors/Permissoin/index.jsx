import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const PageForms = () => (
  <Container>
    <Row>
      <Col md={12}>
        <div className="not-found">
          <div className="not-found__content">
            <h1 className="not-found__info" style={{ color: '#cc0000' }}>404</h1>
            <h3 className="not-found__info">โปรตรวจสอบสิทธิ์การเข้าใช้ระบบ!</h3>
          </div>
        </div>
      </Col>
    </Row>
  </Container>
);

export default withTranslation('common')(PageForms);
