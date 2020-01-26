import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderDatePickerDefauleValueField from '../../../../../shared/components/form/DatePickerDefaultValue';
import renderSelectField from '../../../../../shared/components/form/Select';
import renderFileInputField from '../../../../../shared/components/form/FileInput';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createBy: eFillingSys.registerId,
      laboratoryRoom: [],
      projectaccordingtypemethod: '',
      facultylaboratory: '',
      department: '',
      laboratoryaddress: '',
      building: '',
      floor: '',
      roomnumber: '',
      telephone: '',
      responsibleperson: '',
      workphone: '',
      mobile: '',
      filename1: '',
      filename1base64: '',
      filename2: '',
      filename2base64: '',
      labOtherName: '',
      labOtherNameDisable: true,
      permissionInsert: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeProjectAccordingTypeMethod = this.handleChangeProjectAccordingTypeMethod.bind(this);
    this.handleChangeFile1 = this.handleChangeFile1.bind(this);
    this.handleChangeFile2 = this.handleChangeFile2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      laboratoryRoom: [],
    });
    let initialLaboratory = [];
    Axios
      .get(`PublicDocMenuA/MenuA2InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        initialLaboratory = resp.data.listLaboratoryRoom.map((e) => {
          initialLaboratory = [];
          return e;
        });
        this.setState({
          laboratoryRoom: initialLaboratory,
          permissionInsert: resp.data.userPermission.insert,
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeProjectAccordingTypeMethod = (projectaccordingtypemethod) => {
    this.setState({ projectaccordingtypemethod: projectaccordingtypemethod.value });
  }

  handleChangeRoomNumber = (e) => {
    this.setState({
      roomnumber: e.value,
      laboratoryUsed: e.value,
    });
    if (e.value === 'Other') {
      this.setState({
        labOtherNameDisable: false,
        labOtherName: '',
      });
    } else {
      this.setState({ labOtherNameDisable: true });
    }
  }

  handleChangeFile1 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        filename1: e.name,
        filename1base64: btoa(binaryString),
      });
    };
  }

  handleChangeFile2 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        filename2: e.name,
        filename2base64: btoa(binaryString),
      });
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);

    Axios
      .post('/PublicDocMenuA/AddDocMenuA2', this.state)
      .then((resp) => {
        this.show('success', 'แจ้งให้ทราบ', `ยื่นเอกสาร
        ขอพิจารณาเพื่อการรับรองห้องปฏิบัติการเสร็จสิ้น!`);
        if (resp.data !== null) {
          const url = resp.data.filebase64;
          const a = document.createElement('a');
          a.href = url;
          a.download = resp.data.filename;
          a.click();
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            this.show('danger', 'ข้อผิดผลาด!', 'กรุณาตรวจสอบข้อมูลของท่าน');
          } else {
            this.show('danger', 'Error', error.message);
          }
        } else {
          this.show('danger', 'Error', error.message);
        }
      });
  }

  handleReset = () => {
    const { reset } = this.props;
    this.setState({
      laboratoryRoom: '',
      projectaccordingtypemethod: '',
      facultylaboratory: '',
      department: '',
      laboratoryaddress: '',
      building: '',
      floor: '',
      roomnumber: '',
      telephone: '',
      responsibleperson: '',
      workphone: '',
      mobile: '',
      filename1: '',
      filename1base64: '',
      filename2: '',
      filename2base64: '',
      labOtherNameDisable: true,
    });
    reset();
    document.getElementById('filename1').value = null;
    document.getElementById('filename2').value = null;
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
      laboratoryRoom, projectaccordingtypemethod, facultylaboratory,
      department, laboratoryaddress, building,
      floor, roomnumber, labOtherName, telephone,
      responsibleperson, workphone, mobile,
      filename1, filename2, permissionInsert,
      labOtherNameDisable,
    } = this.state;

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่ยื่นให้ตรวจประเมิน
                </span>
                <div className="form__form-group-field" style={{ backgroundColor: '#F2F4F7' }}>
                  <Field
                    name="dtDoc"
                    component={renderDatePickerDefauleValueField}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ประเภทโครงการวิจัยตามวิธีการ</span>
                <div className="form__form-group-field">
                  <Field
                    name="projectaccordingtypemethod"
                    component={renderSelectField}
                    value={projectaccordingtypemethod}
                    onChange={this.handleChangeProjectAccordingTypeMethod}
                    options={[
                      { value: '1', label: 'แบบประเมินเบื้องต้นสำหรับห้องปฏิบัติการ' },
                      { value: '2', label: 'แบบประเมินเบื้องต้นสำหรับโรงเรือนทดลองสำหรับพืชดัดแปลงพันธุกรรม' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ห้องปฏิบัติการประจำคณะ/หน่วยงาน
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="facultylaboratory"
                    component="input"
                    type="text"
                    value={facultylaboratory}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ภาควิชา/ส่วนงาน
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="department"
                    component="input"
                    type="text"
                    value={department}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ที่อยู่ที่ตั้งห้องปฏิบัติการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="laboratoryaddress"
                    component="input"
                    type="text"
                    value={laboratoryaddress}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  อาคาร
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="building"
                    component="input"
                    type="text"
                    maxLength={100}
                    value={building}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ชั้น/โซน
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="floor"
                    component="input"
                    type="text"
                    maxLength={10}
                    value={floor}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  หมายเลขห้อง
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="roomnumber"
                    component={renderSelectField}
                    value={roomnumber}
                    onChange={this.handleChangeRoomNumber}
                    options={laboratoryRoom}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ห้องปฏิบัติการอื่นๆ</span>
                <div className="form__form-group-field">
                  <Field
                    name="labOtherName"
                    component="input"
                    type="text"
                    value={labOtherName}
                    onChange={this.handleChange}
                    disabled={labOtherNameDisable}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  โทรศัพท์ประจำห้องปฏิบัติการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="telephone"
                    component="input"
                    type="text"
                    maxLength={20}
                    value={telephone}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ชื่อผู้รับผิดชอบห้องปฏิบัติการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="responsibleperson"
                    component="input"
                    type="text"
                    maxLength={100}
                    value={responsibleperson}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  โทรศัพท์ที่ทำงาน
                </span>
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
                <span className="form__form-group-label">
                  โทรศัพท์มือถือ
                </span>
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
              <div className="form__form-group">
                <span className="form__form-group-label">
                  แนบไฟล์แบบคำขอ (NUIBC01)
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="filename1"
                    component={renderFileInputField}
                    value={filename1}
                    onChange={this.handleChangeFile1}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  แนบไฟล์แบบประเมินเบื้องต้น
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="filename2"
                    component={renderFileInputField}
                    value={filename2}
                    onChange={this.handleChangeFile2}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <ButtonToolbar>
                  <Button color="success" type="submit" disabled={!permissionInsert}>บันทึก</Button>
                  <Button onClick={this.handleReset}>ล้าง</Button>
                </ButtonToolbar>
              </div>
            </form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'pages_a2_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
