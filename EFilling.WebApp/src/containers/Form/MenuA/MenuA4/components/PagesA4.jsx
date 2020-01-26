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
      projectList: [],
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      conclusionDate: '',
      file1Name: '',
      file1Base64: '',
      permissionInsert: false,
    };

    this.handleChangeProjectNumber = this.handleChangeProjectNumber.bind(this);
    this.handleChangeFile1 = this.handleChangeFile1.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    let initialProjectNumber = [];
    Axios
      .get(`PublicDocMenuA/MenuA4InterfaceData/${eFillingSys.registerId}`)
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
        });
        // eslint-disable-next-line
        console.log(resp.data);
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

  handleChangeProjectNumber = (projectNumber) => {
    Axios
      .get(`PublicDocMenuA/GetProjectNumberWithDataA4/${projectNumber.value}`)
      .then((resp) => {
        this.setState({ projectNumber: projectNumber.value });
        this.setState({
          projectNumber: projectNumber.value,
          projectHeadName: resp.data.projectheadname,
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
          facultyName: '',
          projectNameThai: '',
          projectNameEng: '',
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
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicDocMenuA/AddDocMenuA4', this.state)
      .then((resp) => {
        this.show('success', 'แจ้งให้ทราบ', `บันทึกเอกสาร
        ขอแก้ไขโครงการตามมติคณะกรรมการเสร็จสิ้น!`);
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
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      file1Name: '',
      file1Base64: '',
      conclusionDate: '',
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
      duration: 5,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  render() {
    const {
      projectList, project1Label, project2Label,
      projectNumber, projectHeadName, facultyName,
      projectNameThai, projectNameEng,
      conclusionDate, file1Name, permissionInsert,
    } = this.state;

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
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
                <span className="form__form-group-label">
                  แนบคำขอชี้แจง/แก้ไขโครงการตามมติคณะกรรมการ
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
  form: 'pages_a4_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
