import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Pages from './components/PagesF1';

const PageForms = ({ t }) => (
  <Container>
    <Row>
      <Col md={12}>
        <h3 className="page-title">{t()}จัดการข้อมูลสมาชิก</h3>
      </Col>
    </Row>
    <Row>
      <Pages />
    </Row>
  </Container>
);

PageForms.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(PageForms);
