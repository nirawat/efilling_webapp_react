import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, Button,
} from 'reactstrap';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderSelectField from '../../../../../shared/components/form/Select';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
const urlParams = new URLSearchParams(window.location.search);
let notificationRU = null;

class PagesF1Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      registerId: urlParams.get('RegisterId'),
      email: '',
      firstName: '',
      fullName: '',
      position: '',
      positionName: '',
      facultyName: '',
      faculty: '',
      workPhone: '',
      mobile: '',
      fax: '',
      education: '',
      educationName: '',
      character: '',
      characterName: '',
      note1: '',
      note2: '',
      note3: '',
      isActive: false,
      permissionEdit: false,
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
    this.loadInterfaceData();
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  loadInterfaceData = () => {
    this.setState({
      email: '',
      firstName: '',
      fullName: '',
      position: '',
      positionName: '',
      facultyName: '',
      faculty: '',
      workPhone: '',
      mobile: '',
      fax: '',
      education: '',
      educationName: '',
      character: '',
      characterName: '',
      note1: '',
      note2: '',
      note3: '',
      isActive: false,
      permissionEdit: false,
    });
    Axios
      .get(`PublicDocMenuF/MenuF1EditInterfaceData/${eFillingSys.registerId}/${urlParams.get('RegisterId')}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.userData != null) {
          this.setState({
            email: resp.data.userData.email,
            firstName: resp.data.userData.firstname,
            fullName: resp.data.userData.fullname,
            position: resp.data.userData.position,
            positionName: resp.data.userData.positionname,
            facultyName: resp.data.userData.facultyname,
            faculty: resp.data.userData.faculty,
            workPhone: resp.data.userData.workphone,
            mobile: resp.data.userData.mobile,
            fax: resp.data.userData.fax,
            education: resp.data.userData.education,
            educationName: resp.data.userData.educationname,
            character: resp.data.userData.character,
            characterName: resp.data.userData.charactername,
            note1: resp.data.userData.note1,
            note2: resp.data.userData.note2,
            note3: resp.data.userData.note3,
            isActive: resp.data.userData.isactive,
            permissionEdit: resp.data.userPermission.edit,
          });
        }
      });
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
      .post('/PublicDocMenuF/UpdateUserRegister', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `บันทึกข้อมูลเสร็จสิ้น
        !`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
      registerId, firstName,
      fullName, position, positionName, email,
      workPhone, mobile, fax,
      faculty, facultyName, education, educationName,
      character, characterName,
      note1, note2, note3, isActive,
      permissionEdit,
    } = this.state;
    return (
      <Col md={6} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form__half">
                <div className="form__form-group">
                  <span className="form__form-group-label">รหัสสมาชิก</span>
                  <div className="form__form-group-field">
                    <Field
                      name="registerId"
                      component="input"
                      type="text"
                      placeholder={registerId}
                      disabled
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">อีเมล์</span>
                  <div className="form__form-group-field">
                    <input
                      name="email"
                      component="input"
                      type="email"
                      value={email}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">คำนำหน้า</span>
                  <div className="form__form-group-field">
                    <input
                      name="firstName"
                      component="input"
                      type="text"
                      maxLength={20}
                      value={firstName}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ชื่อ-สกุล</span>
                  <div className="form__form-group-field">
                    <input
                      name="fullName"
                      component="input"
                      type="text"
                      maxLength={100}
                      value={fullName}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">คณะ/หน่วยงาน</span>
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
                      placeholder={facultyName}
                      onChange={this.handleChangeFaculty}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ตำแหน่งวิชาการ</span>
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
                      placeholder={positionName}
                      onChange={this.handleChangePosition}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">เบอร์โทรที่ทำงาน</span>
                  <div className="form__form-group-field">
                    <input
                      name="workPhone"
                      component="input"
                      type="text"
                      maxLength={20}
                      value={workPhone}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">โทรสาร</span>
                  <div className="form__form-group-field">
                    <input
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
                    <input
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
                      placeholder={educationName}
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
                        { value: '4', label: 'ประธานกรรมการผู้พิจารณา' },
                        { value: '5', label: 'รองประธานกรรมการผู้พิจารณา' },
                        { value: '6', label: 'เลขานุการกรรมการผู้พิจารณา' },
                        { value: '7', label: 'ผู้ช่วยเลขานุการกรรมการผู้พิจารณา' },
                      ]}
                      value={character}
                      placeholder={characterName}
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
                  <span className="form__form-group-label">สถานะ</span>
                  <div className="form__form-group-field">
                    <input
                      name="isActive"
                      component="input"
                      type="checkbox"
                      checked={isActive}
                      onChange={(event, value) => this.setState({ isActive: value })}
                      style={{ width: '20px' }}
                    />
                    <span className="checkbox-btn__label form__form-group-label" style={{ color: '#FF0000' }}>
                      ยินยอมให้สามารถเข้าใช้งานในระบบ
                    </span>
                  </div>
                </div>
                <div className="form__form-group">
                  <Button color="success" type="submit" disabled={!permissionEdit}>บันทึก</Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'pages_f1_edit', // a unique identifier for this form
})(PagesF1Edit);
