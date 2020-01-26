import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';

const Register = () => (
  <div className="account">
    <div className="account__wrapper">
      <div className="account__card">
        <div className="account__head">
          <h3 className="account__title">ลงทะเบียน
          </h3>
          <h4 className="account__subhead subhead">ลงทะเบียนเข้าใช้ระบบ</h4>
        </div>
        <RegisterForm onSubmit />
        <div className="account__have-account">
          <p>กรณีมีบัญชีอยู่แล้ว? <Link to="/log_in">Login</Link></p>
        </div>
      </div>
    </div>
  </div>
);

export default Register;
