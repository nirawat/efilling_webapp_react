import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Button,
} from 'reactstrap';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import renderCheckBoxField from '../../../../shared/components/form/CheckBox';
import { BasicNotification } from '../../../../shared/components/Notification';

Config.set({
  // axiosBaseUrl: 'https://localhost:5001/api',
  axiosBaseUrl: 'http://119.59.115.77:7001/api',
  axiosToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUSCBEZXZlbG9wZXIuY29tIiwibmFtZSI6IkFkbWluaXN0cmF0b3IiLCJpYXQiOjE1MTYyMzkwMjJ9.kXiEpmOgP1cn7Se1BaKJkFKyfkAtp4hQq-JHraUvd-E',
  axiosContentType: 'application/json;charset=utf-8',
});

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

let notificationRU = null;

class LogInForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      userid: '',
      passw: '',
    };

    this.showPassword = this.showPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleRegisterClick = () => {
    window.location = '/efilling/register';
  }

  handleSubmit = (e) => {
    e.preventDefault();

    Axios
      .post('/PublicSystem/LogIn', this.state)
      .then((resp) => {
        localStorage.setItem('efilling_system', JSON.stringify(resp.data.data));
        window.location = '/efilling/forms/home';
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            this.show('danger', 'ข้อผิดผลาด!', 'กรุณาตรวจสอบข้อมูลการเข้าใช้ระบบของท่าน หรือติดต่อเจ้าหน้าที่');
          } else {
            this.show('danger', 'Error', error.message);
          }
        } else {
          this.show('danger', 'Error', error.message);
        }
      });
  }

  show = (color, title, message) => {
    notificationRU.notice({
      content: <BasicNotification
        color={color}
        title={title}
        message={message}
      />,
      duration: 5,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  showPassword(e) {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  }

  render() {
    const { showPassword, userid, passw } = this.state;

    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form__form-group">
          <span className="form__form-group-label">ชื่อผู้ใช้</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <Field
              name="userid"
              component="input"
              type="text"
              placeholder="User ID"
              value={userid}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">รหัสผ่าน</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="passw"
              component="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={passw}
              onChange={this.handleChange}
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
            <Field
              name="remember_me"
              component={renderCheckBoxField}
              label="จดจำข้อมูล"
            />
          </div>
        </div>
        <div className="account__btns">
          <Button color="success" className="rounded" type="submit">เข้าสู่ระบบ</Button>
          <Button color="success" className="rounded" onClick={this.handleRegisterClick}>ลงทะเบียน</Button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'log_in_form', // a unique identifier for this form
})(LogInForm);
