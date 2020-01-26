import React, { PureComponent } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const urlParams = new URLSearchParams(window.location.search);

class RegisterComplete extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__form-group">
          <span className="form__form-group-label">รหัสลงทะเบียนของท่านคือ</span>
          <div>
            <h2 className="form__form-group-label">{urlParams.get('RegisterId')}</h2>
          </div>
          <span className="form__form-group-label">กรุณาตรวจสอบอีเมล์ของท่านและทำการยืนยันตัวตนเพื่อเข้าสู่ระบบ</span>
        </div>
        <div className="account__btns">
          <Link
            className="btn btn-success account__btn rounded"
            to="/log_in"
          >
            กลับสู่หน้าล๊อคอิน
          </Link>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'register_complete', // a unique identifier for this form
})(RegisterComplete);
