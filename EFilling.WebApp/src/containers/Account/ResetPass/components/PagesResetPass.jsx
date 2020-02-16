import React, { PureComponent } from 'react';
import { reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, Row, Button,
} from 'reactstrap';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../shared/components/Notification';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;

class PagesChangePassw extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      registerId: eFillingSys.registerId,
      oldPassw: '',
      newPassw: '',
      confirmPassw: '',
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

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

  handleSubmit = (e) => {
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicRegister/ResetPassword', this.state)
      .then((resp) => {
        if (resp.data.status === true) {
          this.show('success', 'แจ้งให้ทราบ!', 'บันทึกข้อมูลเสร็จสิ้น');
          setTimeout(() => {
            window.location.replace('/log_in');
          }, 1000);
        } else {
          this.show('danger', 'แจ้งให้ทราบ!', resp.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          buttonSaveStatus: 'บันทึก',
          buttonSaveEnable: true,
        });
        if (error.response) {
          if (error.response.status === 400) {
            this.show('danger', 'ข้อผิดผลาด!', error.message);
          } else {
            this.show('danger', 'Error', error.message);
          }
        } else {
          this.show('danger', 'Error', error.message);
        }
      });
    e.preventDefault();
  }

  show = (color, title, message) => {
    notificationRU.notice({
      content: <BasicNotification
        color={color}
        title={title}
        message={message}
      />,
      duration: 15,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  render() {
    const {
      oldPassw, newPassw, confirmPassw,
    } = this.state;
    return (
      <Col sm={3} md={3}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <Row>
                <Col xs="12">
                  <div className="form__form-group">
                    <span className="form__form-group-label">รหัสผ่านเดิม</span>
                    <div className="form__form-group-field">
                      <input
                        name="oldPassw"
                        component="input"
                        type="password"
                        value={oldPassw}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form__form-group">
                    <span className="form__form-group-label">รหัสผ่านใหม่</span>
                    <div className="form__form-group-field">
                      <input
                        name="newPassw"
                        component="input"
                        type="password"
                        value={newPassw}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form__form-group">
                    <span className="form__form-group-label">ยืนยันรหัสผ่าน</span>
                    <div className="form__form-group-field">
                      <input
                        name="confirmPassw"
                        component="input"
                        type="password"
                        value={confirmPassw}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form__form-group">
                    <Button color="success" type="submit">บันทึก</Button>
                  </div>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'pages_change_passw', // a unique identifier for this form
})(PagesChangePassw);
