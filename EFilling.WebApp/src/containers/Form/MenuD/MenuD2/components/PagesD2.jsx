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
import renderDatePickerField from '../../../../../shared/components/form/DatePicker';
import renderSelectField from '../../../../../shared/components/form/Select';

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
      listYearOfMeeting: [],
      listDownloadFile: [],
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      projectNumber: '',
      projectHeadName: '',
      projectNameThai: '',
      projectNameEng: '',
      acceptTypeNameThai: '',
      remarkApproval: '',
      conclusionDate: '',
      fileDownloadName: '',
      agendaNumber: '',
      defaultYear: '',
      yearOfMeeting: '',
      agendaMeetingDate: '',
      permissionInsert: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeProjectNumber = this.handleChangeProjectNumber.bind(this);
    this.handleChangeFileDownloadId = this.handleChangeFileDownloadId.bind(this);
    this.handleChangeAgendaMeetingDate = this.handleChangeAgendaMeetingDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      projectList: [],
      listYearOfMeeting: [],
      defaultYear: '',
      yearOfMeeting: '',
    });
    let initialProjectNumber = [];
    let initialYear = [];
    Axios
      .get(`PublicDocMenuD/MenuD2InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.listProjectNumber != null) {
          initialProjectNumber = resp.data.listProjectNumber.map((e) => {
            initialProjectNumber = [];
            return e;
          });
        }
        initialYear = resp.data.listYearOfMeeting.map((e) => {
          initialYear = [];
          return e;
        });
        this.setState({
          projectList: initialProjectNumber,
          listYearOfMeeting: initialYear,
          defaultYear: resp.data.defaultyear,
          yearOfMeeting: resp.data.defaultyear,
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

  handleChangeProjectNumber = (projectNumber) => {
    this.setState({
      listDownloadFile: [],
      projectNumber: '',
      projectHeadName: '',
      projectNameThai: '',
      projectNameEng: '',
      acceptTypeNameThai: '',
      remarkApproval: '',
      conclusionDate: '',
    });
    let initialDownloadFile = [];
    Axios
      .get(`PublicDocMenuD/GetProjectNumberWithDataD2/${projectNumber.value}`)
      .then((resp) => {
        if (resp.data.listDownloadFile != null) {
          initialDownloadFile = resp.data.listDownloadFile.map((ee) => {
            initialDownloadFile = [];
            return ee;
          });
        }
        this.setState({
          listDownloadFile: initialDownloadFile,
          projectNumber: projectNumber.value,
          projectHeadName: resp.data.projectheadname,
          projectNameThai: resp.data.projectname1,
          projectNameEng: resp.data.projectname2,
          acceptTypeNameThai: resp.data.certificatetype,
          remarkApproval: resp.data.remarkapproval,
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
      });
  }

  handleChangeFileDownloadId = (e) => {
    this.setState({ fileDownloadName: e.value });
    Axios
      .get(`PublicDocMenuD/GetAllDownloadFileByFileName/${e.value}`)
      .then((resp) => {
        const url = window.atob(resp.data.filebase64);
        const a = document.createElement('a');
        a.href = url;
        a.download = e.label;
        a.click();
      });
  }

  handleChangeYearOfMeeting = (e) => {
    this.setState({ yearOfMeeting: e.value });
  }

  handleChangeAgendaMeetingDate = (e) => {
    this.setState({ agendaMeetingDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicDocMenuD/AddDocMenuD2', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `บันทึกเอกสาร
        ปิดโครงการและบรรจุเพื่อพิจารณารับรองเสร็จสิ้น!`);
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
      projectNameThai: '',
      projectNameEng: '',
      acceptTypeNameThai: '',
      remarkApproval: '',
      conclusionDate: '',
      fileDownloadName: '',
      agendaNumber: '',
      defaultYear: '',
      yearOfMeeting: '',
      agendaMeetingDate: '',
    });
    reset();
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
      project1Label, project2Label,
      projectList, listYearOfMeeting, listDownloadFile,
      projectNumber, projectHeadName, projectNameThai,
      projectNameEng, acceptTypeNameThai,
      remarkApproval, conclusionDate, agendaNumber,
      fileDownloadName, defaultYear, yearOfMeeting,
      agendaMeetingDate, permissionInsert,
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
                <span className="form__form-group-label">ดาวน์โหลดข้อเสนอ</span>
                <div className="form__form-group-field">
                  <Field
                    name="fileDownloadName"
                    component={renderSelectField}
                    value={fileDownloadName}
                    onChange={this.handleChangeFileDownloadId}
                    options={listDownloadFile}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  บรรจุเข้าเป็นวาระการประชุมครั้งที่
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="agendaNumber"
                    component="input"
                    type="number"
                    value={agendaNumber}
                    onChange={this.handleChange}
                  />
                  <span className="form__form-group-label">/</span>
                  <Field
                    name="yearOfMeeting"
                    component={renderSelectField}
                    value={yearOfMeeting}
                    placeholder={defaultYear}
                    onChange={this.handleChangeYearOfMeeting}
                    options={listYearOfMeeting}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  กำหนดวันที่ประชุม
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="agendaMeetingDate"
                    component={renderDatePickerField}
                    value={agendaMeetingDate}
                    selected={agendaMeetingDate}
                    onChange={this.handleChangeAgendaMeetingDate}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">มติคณะกรรมการ (รับรอง)</span>
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
                  ความเห็นประกอบและข้อเสนอแนะ
                </span>
                <div className="form__form-group-field">
                  <textarea
                    name="remarkApproval"
                    component="input"
                    type="textarea"
                    placeholder={remarkApproval}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่มีมติ
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
  form: 'pages_d2_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
