import React from 'react';
import RegisterComplete from './components/RegisterComplete';

const Register = () => (
  <div className="account">
    <div className="account__wrapper">
      <div className="account__card">
        <div className="account__head">
          <h3 className="account__title">ลงทะเบียนเสร็จสิ้น!</h3>
          <h4 className="account__subhead subhead">แจ้งผลการลงทะเบียน</h4>
        </div>
        <RegisterComplete onSubmit />
      </div>
    </div>
  </div>
);

export default Register;
