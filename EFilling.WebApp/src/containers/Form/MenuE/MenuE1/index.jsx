import React from 'react';
import { Col, Row } from 'reactstrap';
import Pages from './components/PagesE1';
import PageReport from './components/PageReport';

const PageE1 = () => (
  <div style={{ padding: '20px' }}>
    <Row>
      <Col md={12}>
        <div style={{ paddingLeft: '20px' }}>
          <h2 className="page-title">การแจ้งรายการเชื้อโรคและพิษจากสัตว์</h2>
          <h3 className="page-subhead subhead">โปรดกรอกข้อมูลที่จำเป็นให้ครบทุกช่องตามเครื่องหมาย</h3>
        </div>
      </Col>
    </Row>
    <Row>
      <Pages />
      <PageReport />
    </Row>
  </div>
);

export default PageE1;
