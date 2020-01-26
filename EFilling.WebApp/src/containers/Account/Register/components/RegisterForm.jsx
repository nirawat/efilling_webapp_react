import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Button,
} from 'reactstrap';
import Config from 'react-global-configuration';
import Axios from 'axios';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import MailRuIcon from 'mdi-react/MailRuIcon';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../shared/components/Notification';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

let notificationRU = null;

class RegisterForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      showConfPassword: false,
      email: '',
      userid: '',
      passw: '',
      confirmpassw: '',
    };

    this.showPassword = this.showPassword.bind(this);
    this.showConfPassword = this.showConfPassword.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    // eslint-disable-next-line
    console.log(this.state);
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    Axios
      .post('/PublicRegister/RegisterUser', this.state)
      .then((resp) => {
        window.location = `/efilling/RegisterComplete?RegisterId=${resp.data.registerId}`;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            this.show('danger', 'ข้อผิดผลาด!', 'กรุณาตรวจสอบข้อมูลการลงทะเบียนของท่าน หรือติดต่อเจ้าหน้าที่');
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

  showConfPassword(e) {
    e.preventDefault();
    this.setState(prevState => ({ showConfPassword: !prevState.showConfPassword }));
  }

  render() {
    const {
      showPassword, showConfPassword, email,
      userid, passw, confirmpassw,
    } = this.state;
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form__form-group">
          <span className="form__form-group-label">ชื่อผู้ใช้ระบบ</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <Field
              name="userid"
              component="input"
              type="text"
              placeholder="User ID"
              maxLength={20}
              value={userid}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">รหัสผ่าน (6-10 ตัวอักษร)</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="passw"
              component="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              minLength={6}
              maxLength={10}
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
          <span className="form__form-group-label">ยืนรหัสผ่าน (6-10 ตัวอักษร)</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="confirmpassw"
              component="input"
              type={showConfPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              minLength={6}
              maxLength={10}
              value={confirmpassw}
              onChange={this.handleChange}
            />
            <button
              type="button"
              className={`form__form-group-button${showConfPassword ? ' active' : ''}`}
              onClick={e => this.showConfPassword(e)}
            ><EyeIcon />
            </button>
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">อีเมล์</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <MailRuIcon />
            </div>
            <Field
              name="email"
              component="input"
              type="email"
              placeholder="example@mail.com"
              maxLength={200}
              value={email}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div>
          <Button color="success" className="rounded" type="submit">ลงทะเบียน</Button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'register_form', // a unique identifier for this form
})(RegisterForm);
