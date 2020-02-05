import React from 'react';
import { Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Pages from './components/PagesHome';

const PageForms = () => (
  <Container>
    <Row>
      <Pages />
    </Row>
  </Container>
);

export default withTranslation('common')(PageForms);
