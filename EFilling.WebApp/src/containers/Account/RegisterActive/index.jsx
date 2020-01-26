import React from 'react';
import RegisterActive from './components/RegisterActive';

const Register = () => (
  <div className="account">
    <div className="account__wrapper">
      <div className="account__register_active_card">
        <div className="account__head">
          <h3 className="account__title">ยืนยันการลงทะเบียน
          </h3>
          <h4 className="account__subhead subhead">ยืนยันตัวตนเพื่อเข้าใช้ระบบ</h4>
        </div>
        <RegisterActive onSubmit />
      </div>
    </div>
  </div>
);

export default Register;
