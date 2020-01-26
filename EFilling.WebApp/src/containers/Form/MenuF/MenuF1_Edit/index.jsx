import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Pages from './components/PagesF1Edit';

const PageForms = ({ t }) => (
  <Container>
    <Row>
      <Col md={12}>
        <h3 className="page-title">{t()}ข้อมูลสมาชิก <span className="form__form-group-label" style={{ color: '#FF0000' }}> (แก้ไข)</span></h3>
        <h3 className="page-subhead subhead">ข้อมูลประวัติสมาชิก
        </h3>
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
