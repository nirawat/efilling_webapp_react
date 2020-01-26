import React from 'react';
import LogInForm from './components/LogInForm';

const LogIn = () => (
  <div className="account">
    <div className="account__wrapper">
      <div className="account__card">
        <div className="account__head">
          <h3 className="account__title">ยินดีต้อนรับเข้าสู่
          </h3>
          <h5>ระบบสารสนเทศเพื่อการจัดการโครงการ
            ที่ส่งขอรับพิจารณาความปลอดภัยทางชีวภาพ
          </h5>
          <h4 className="account__subhead subhead">มหาวิทยาลัยสเรศวร</h4>
        </div>
        <LogInForm onSubmit />
      </div>
    </div>
  </div>
);

export default LogIn;
