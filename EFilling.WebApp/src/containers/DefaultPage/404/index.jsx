import React from 'react';
import { Link } from 'react-router-dom';

const NotFound404 = () => (
  <div className="not-found">
    <div className="not-found__content">
      <h1 className="not-found__info">404</h1>
      <h3 className="not-found__info">Ooops! ไม่พบเพจที่กำลังใช้งาน :(</h3>
      <Link className="btn btn-success" to="/log_in">กลับสู่หน้าล๊อคอิน!</Link>
    </div>
  </div>
);

export default NotFound404;
