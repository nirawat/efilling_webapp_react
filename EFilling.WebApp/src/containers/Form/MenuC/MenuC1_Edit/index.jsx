import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Pages from './components/PagesC1_Edit';

const PageForms = ({ t }) => (
  <Container>
    <Row>
      <Col md={12}>
        <h3 className="page-title">{t()}การมอบหมายผู้พิจารณาโครงการ <span className="form__form-group-label" style={{ color: '#FF0000' }}> (แก้ไข)</span></h3>
        <h3 className="page-subhead subhead">โปรดกรอกข้อมูลที่จำเป็นให้ครบทุกช่องตามเครื่องหมาย *
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
