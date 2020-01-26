import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class AccountForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
    };

    this.showPassword = this.showPassword.bind(this);
  }

  showPassword(e) {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  }

  render() {
    const { handleSubmit } = this.props;
    const { showPassword } = this.state;

    return (
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__form-group form__form-group--forgot">
          <span className="form__form-group-label">รหัสผ่าน</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="password"
              component="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
            />
            <button
              className={`form__form-group-button${showPassword ? ' active' : ''}`}
              type="button"
              onClick={e => this.showPassword(e)}
            ><EyeIcon />
            </button>
          </div>
          <div className="account__forgot-password">
            <a href="/">ลืมรหัสผ่าน?</a>
          </div>
        </div>
        <Link className="btn btn-success account__btn rounded" to="/dashboard_default">ปลดล๊อคหน้าจอ</Link>
        <Link className="btn btn-outline-danger account__btn rounded" to="/dashboard_default">ออกจากระบบ</Link>
      </form>
    );
  }
}

export default reduxForm({
  form: 'account_lock_form', // a unique identifier for this form
})(AccountForm);
