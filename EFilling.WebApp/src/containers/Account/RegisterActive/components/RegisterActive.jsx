import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Col, Button } from 'reactstrap';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../shared/components/Notification';
import renderSelectField from '../../../../shared/components/form/Select';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const urlParams = new URLSearchParams(window.location.search);
let notificationRU = null;

class RegisterActive extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      registerid: urlParams.get('RegisterId'),
      email: '',
      passw: '',
      firstname: '',
      fullname: '',
      position: '',
      faculty: '',
      workphone: '',
      mobile: '',
      fax: '',
      education: '',
      character: '',
      note1: '',
      note2: '',
      note3: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangePosition = this.handleChangePosition.bind(this);
    this.handleChangeFaculty = this.handleChangeFaculty.bind(this);
    this.handleChangeEducation = this.handleChangeEducation.bind(this);
    this.handleChangeCharacter = this.handleChangeCharacter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    Axios
      .get(`PublicRegister/GetRegisterUserInActive/${urlParams.get('RegisterId')}`)
      .then((resp) => {
        this.setState({
          email: resp.data.email,
        });
      })
      .catch(() => {
        window.location = '/efilling/404';
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangePosition = (position) => {
    this.setState({ position: position.value });
  }

  handleChangeFaculty = (faculty) => {
    this.setState({ faculty: faculty.value });
  }

  handleChangeEducation = (education) => {
    this.setState({ education: education.value });
  }

  handleChangeCharacter = (character) => {
    this.setState({ character: character.value });
  }

  handleSubmit = (e) => {
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicRegister/RegisterActive', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `คุณได้ลงทะเบียนเสร็จสิ้นขั้นตอนแล้ว
        ระบบจะนำคุณไปสู่หน้าล๊อคอินเพื่อการใช้งาน โดยอัตโนมัติ!`);
        setTimeout(() => {
          window.location = '/efilling/log_in';
        }, 3000);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            this.show('danger', 'ข้อผิดผลาด!', 'กรุณาตรวจสอบข้อมูลการลงทะเบียนของท่าน');
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
      duration: 5,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  render() {
    const {
      registerid, firstname,
      fullname, position, email,
      workphone, mobile, fax,
      faculty, education, character,
      note1, note2, note3,
    } = this.state;
    return (
      <Col md={6} lg={12}>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form__half">
            <div className="form__form-group">
              <span className="form__form-group-label">รหัสลงทะเบียน</span>
              <div className="form__form-group-field">
                <Field
                  name="registerid"
                  component="input"
                  type="text"
                  placeholder={registerid}
                  disabled
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">อีเมล์</span>
              <div className="form__form-group-field">
                <Field
                  name="email"
                  component="input"
                  type="email"
                  placeholder={email}
                  disabled
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">คำนำหน้า</span>
              <div className="form__form-group-field">
                <Field
                  name="firstname"
                  component="input"
                  type="text"
                  maxLength={20}
                  value={firstname}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">ชื่อ-สกุล</span>
              <div className="form__form-group-field">
                <Field
                  name="fullname"
                  component="input"
                  type="text"
                  maxLength={100}
                  value={fullname}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">
                คณะ/หน่วยงาน
              </span>
              <div className="form__form-group-field">
                <Field
                  name="faculty"
                  component={renderSelectField}
                  options={[
                    { value: '1', label: 'คณะเกษตรศาสตร์ฯ' },
                    { value: '2', label: 'คณะเภสัชศาสตร์' },
                    { value: '3', label: 'คณะวิทยาศาสตร์การแพทย์' },
                  ]}
                  value={faculty}
                  onChange={this.handleChangeFaculty}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">สถานะภาพ</span>
              <div className="form__form-group-field">
                <Field
                  name="position"
                  component={renderSelectField}
                  options={[
                    { value: '1', label: 'นักวิชาการ' },
                    { value: '2', label: 'อาจารย์' },
                    { value: '3', label: 'ที่ปรึกษาโครงการ' },
                  ]}
                  value={position}
                  onChange={this.handleChangePosition}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">เบอร์โทรที่ทำงาน</span>
              <div className="form__form-group-field">
                <Field
                  name="workphone"
                  component="input"
                  type="text"
                  maxLength={20}
                  value={workphone}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">โทรสาร</span>
              <div className="form__form-group-field">
                <Field
                  name="fax"
                  component="input"
                  type="text"
                  maxLength={20}
                  value={fax}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">เบอร์มือถือ</span>
              <div className="form__form-group-field">
                <Field
                  name="mobile"
                  component="input"
                  type="text"
                  maxLength={10}
                  value={mobile}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="form__half">
            <div className="form__form-group">
              <span className="form__form-group-label">ระดับการศึกษา</span>
              <div className="form__form-group-field">
                <Field
                  name="education"
                  component={renderSelectField}
                  options={[
                    { value: '1', label: 'ปริญญาเอก' },
                    { value: '2', label: 'ปริญญาโท' },
                    { value: '3', label: 'ปริญญาตรี' },
                    { value: '4', label: 'ต่ำกว่าปริญญาตรี' },
                  ]}
                  value={education}
                  onChange={this.handleChangeEducation}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">ฐานและบทบาท</span>
              <div className="form__form-group-field">
                <Field
                  name="character"
                  component={renderSelectField}
                  options={[
                    { value: '1', label: 'นักวิจัย/นิสิต' },
                    { value: '2', label: 'กรรมการผู้พิจารณา' },
                    { value: '3', label: 'เจ้าหน้าที่บริหาร' },
                    { value: '4', label: 'ที่ปรึกษา' },
                    { value: '5', label: 'ประธานกรรมการผู้พิจารณา' },
                    { value: '6', label: 'รองประธานกรรมการผู้พิจารณา' },
                    { value: '7', label: 'เลขานุการกรรมการผู้พิจารณา' },
                    { value: '8', label: 'ผู้ช่วยเลขานุการกรรมการผู้พิจารณา' },
                  ]}
                  value={character}
                  onChange={this.handleChangeCharacter}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">ประวัติและประสบการณ์ที่เกี่ยวข้องกับความปลอดภัยทางชีวภาพ</span>
              <div className="form__form-group-field">
                <textarea
                  name="note1"
                  component="input"
                  placeholder="Note 1"
                  value={note1}
                  onChange={this.handleChange}
                  textarea="true"
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">ประวัติการฝึกอบรมที่เกี่ยวข้องกับความปลอดภัยทางชีวภาพ</span>
              <div className="form__form-group-field">
                <textarea
                  name="note2"
                  component="input"
                  type="text"
                  placeholder="Note 2"
                  value={note2}
                  onChange={this.handleChange}
                  textarea="true"
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">ผลงานวิชาการที่เกี่ยวข้องกับความปลอดภัยทางชีวภาพ</span>
              <div className="form__form-group-field">
                <textarea
                  name="note3"
                  component="input"
                  type="text"
                  placeholder="Note 3"
                  value={note3}
                  onChange={this.handleChange}
                  textarea="true"
                />
              </div>
            </div>
            <div className="form__form-group">
              <Button color="success" className="rounded" type="submit">ยืนยันข้อมูล</Button>
            </div>
          </div>
        </form>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'register_active', // a unique identifier for this form
})(RegisterActive);
