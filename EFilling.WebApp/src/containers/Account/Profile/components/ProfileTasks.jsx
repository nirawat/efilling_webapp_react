import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';

class ProfileTasks extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
    };
  }

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    const { handleSubmit } = this.props;
    const { showPassword } = this.state;

    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">เปลี่ยนรหัสผ่าน</h5>
              <h5 className="subhead">การตั้งรหัสผ่านควรมีจำนวนตัวอักษรตั้งแต่ 6-10 ตัวอักษร</h5>
            </div>
            <div className="profile__current-tasks">
              <form className="form" onSubmit={handleSubmit}>
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-icon">
                      <KeyVariantIcon />
                    </div>
                    <Field
                      name="txtOldPassword"
                      component="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="รหัสผ่านเดิม"
                    />
                    <button
                      type="button"
                      className={`form__form-group-button${showPassword ? ' active' : ''}`}
                      onClick={e => this.showPassword(e)}
                    ><EyeIcon />
                    </button>
                  </div>
                </div>
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-icon">
                      <KeyVariantIcon />
                    </div>
                    <Field
                      name="txtNewPassword"
                      component="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="รหัสผ่านใหม่"
                    />
                    <button
                      type="button"
                      className={`form__form-group-button${showPassword ? ' active' : ''}`}
                      onClick={e => this.showPassword(e)}
                    ><EyeIcon />
                    </button>
                  </div>
                </div>
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-icon">
                      <KeyVariantIcon />
                    </div>
                    <Field
                      name="txtConfirmPassword"
                      component="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="ยืนยันรหัสผ่านใหม่"
                    />
                    <button
                      type="button"
                      className={`form__form-group-button${showPassword ? ' active' : ''}`}
                      onClick={e => this.showPassword(e)}
                    ><EyeIcon />
                    </button>
                  </div>
                </div>
                <ButtonToolbar className="form__button-toolbar">
                  <Button color="success" type="submit">ยืนยัน</Button>
                </ButtonToolbar>
              </form>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'vertical_form_layout_with_icons', // a unique identifier for this form
})(withTranslation('common')(ProfileTasks));
