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
      projectList: [],
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      projectNumber: '',
      projectHeadName: '',
      positionNameThai: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      acceptTypeNameThai: '',
      conclusionDate: '',
      renewRound: '',
      file1Name: '',
      file1Base64: '',
      permissionInsert: false,
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeProjectNumber = this.handleChangeProjectNumber.bind(this);
    this.handleChangeFile1 = this.handleChangeFile1.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    let initialProjectNumber = [];
    Axios
      .get(`PublicDocMenuA/MenuA6InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        initialProjectNumber = resp.data.listProjectNumber.map((e) => {
          initialProjectNumber = [];
          return e;
        });
        this.setState({
          projectList: initialProjectNumber,
          permissionInsert: resp.data.userPermission.insert,
          buttonSaveEnable: resp.data.userPermission.insert,
        });
      })
      .catch(() => {
        this.setState({
          projectList: [],
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeProjectNumber = (projectNumber) => {
    Axios
      .get(`PublicDocMenuA/GetProjectNumberWithDataA6/${projectNumber.value}`)
      .then((resp) => {
        this.setState({ projectNumber: projectNumber.value });
        this.setState({
          projectNumber: projectNumber.value,
          projectHeadName: resp.data.projectheadname,
          positionNameThai: resp.data.positionname,
          facultyName: resp.data.facultyname,
          projectNameThai: resp.data.projectname1,
          projectNameEng: resp.data.projectname2,
          acceptTypeNameThai: resp.data.certificatetype,
          conclusionDate: resp.data.dateofapproval,
        });
        if (resp.data.isprojectgroup === true) {
          this.setState({
            project1Label: 'ชื่อโครงการภาษาไทย',
            project2Label: 'ชื่อโครงการภาษาอังกฤษ',
          });
        } else {
          this.setState({
            project1Label: 'ประเภทห้องปฏิบัติการ',
            project2Label: 'ห้องปฏิบัติการประจำคณะ',
          });
        }
        return '';
      })
      .catch(() => {
        this.setState({
          projectNumber: '',
          projectHeadName: '',
          positionNameThai: '',
          facultyName: '',
          projectNameThai: '',
          projectNameEng: '',
          acceptTypeNameThai: '',
          conclusionDate: '',
        });
      });
  }

  handleChangeFile1 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        file1Name: e.name,
        file1Base64: btoa(binaryString),
      });
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicDocMenuA/AddDocMenuA6', this.state)
      .then((resp) => {
        this.show('success', 'แจ้งให้ทราบ', `บันทึกเอกสาร
        ขอต่ออายุโครงการเสร็จสิ้น!`);
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
        const { permissionInsert } = this.state;
        this.setState({
          buttonSaveStatus: 'บันทึก',
          buttonSaveEnable: permissionInsert,
        });
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
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      projectNumber: '',
      projectHeadName: '',
      positionNameThai: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      acceptTypeNameThai: '',
      conclusionDate: '',
      file1Name: '',
      file1Base64: '',
      renewRound: '',
    });
    reset();
    document.getElementById('file1Name').value = null;
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
      projectList, project1Label, project2Label,
      projectNumber, projectHeadName, positionNameThai, facultyName,
      projectNameThai, projectNameEng, acceptTypeNameThai,
      conclusionDate, renewRound, file1Name,
      buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่บันทึก
                </span>
                <div className="form__form-group-field" style={{ backgroundColor: '#F2F4F7' }}>
                  <Field
                    name="dtDoc"
                    component={renderDatePickerDefauleValueField}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  เลขสำคัญโครงการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="projectNumber"
                    component={renderSelectField}
                    value={projectNumber}
                    onChange={this.handleChangeProjectNumber}
                    options={projectList}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  หัวหน้าโครงการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="projectHeadName"
                    component="input"
                    type="text"
                    placeholder={projectHeadName}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ตำแหน่งหน้าที่
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="positionNameThai"
                    component="input"
                    type="text"
                    placeholder={positionNameThai}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  คณะ/หน่วย
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="facultyName"
                    component="input"
                    type="text"
                    placeholder={facultyName}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">{project1Label}</span>
                <div className="form__form-group-field">
                  <Field
                    name="projectNameThai"
                    component="input"
                    type="text"
                    placeholder={projectNameThai}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">{project2Label}</span>
                <div className="form__form-group-field">
                  <Field
                    name="projectNameEng"
                    component="input"
                    type="text"
                    placeholder={projectNameEng}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ประเภทการรับรอง</span>
                <div className="form__form-group-field">
                  <Field
                    name="acceptTypeNameThai"
                    component="input"
                    type="text"
                    placeholder={acceptTypeNameThai}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่มีมตติรับรอง
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="conclusionDate"
                    component="input"
                    type="text"
                    placeholder={conclusionDate}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ต่ออายุครั้งที่</span>
                <div className="form__form-group-field">
                  <Field
                    name="renewRound"
                    component="input"
                    type="number"
                    value={renewRound}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  แนบเอกสารรายงานขอต่ออายุโครงการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    id="file1Name"
                    name="file1Name"
                    component={renderFileInputField}
                    value={file1Name}
                    onChange={this.handleChangeFile1}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <ButtonToolbar>
                  <Button color="success" type="submit" disabled={!buttonSaveEnable}>{buttonSaveStatus}</Button>
                  <Button onClick={() => window.location.reload()}>ล้าง</Button>
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
  form: 'pages_a4_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
