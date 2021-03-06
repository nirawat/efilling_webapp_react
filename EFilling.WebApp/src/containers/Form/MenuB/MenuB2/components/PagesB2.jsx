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
import renderDatePickerField from '../../../../../shared/components/form/DatePicker';

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
      listLabNumber: [],
      listYearOfProject: [],
      listDownloadFile: [],
      defaultYear: '',
      acceptType: '2',
      projectId: '',
      labNumber: '',
      labTypeName: '',
      facultyName: '',
      initialResult: '',
      fileDownloadName: '',
      projectKeyNumber: '',
      notes: '',
      acronyms: '',
      roundOfMeeting: '',
      yearOfMeeting: '',
      meetingDate: '',
      permissionInsert: false,
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAcceptType = this.handleChangeAcceptType.bind(this);
    this.handleChangeLabNumber = this.handleChangeLabNumber.bind(this);
    this.handleChangeInitialResult = this.handleChangeInitialResult.bind(this);
    this.handleChangeFileDownloadId = this.handleChangeFileDownloadId.bind(this);
    this.handleChangeMeetingDate = this.handleChangeMeetingDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      listLabNumber: [],
      listYearOfProject: [],
      projectKeyNumber: '',
    });
    let initialLabNumber = [];
    let initialYear = [];
    Axios
      .get(`PublicDocMenuB/MenuB2InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.listLabNumber != null) {
          initialLabNumber = resp.data.listLabNumber.map((e) => {
            initialLabNumber = [];
            return e;
          });
        }
        initialYear = resp.data.listYearOfProject.map((e) => {
          initialYear = [];
          return e;
        });
        this.setState({
          listLabNumber: initialLabNumber,
          listYearOfProject: initialYear,
          defaultYear: resp.data.defaultyear,
          yearOfMeeting: resp.data.defaultyear,
          permissionInsert: resp.data.userPermission.insert,
          buttonSaveEnable: resp.data.userPermission.insert,
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeAcceptType = (e) => {
    if (e.value === '1') {
      window.location = '/efilling/forms/menuB/menuB1';
    }
    this.setState({ acceptType: e.value });
  }

  handleChangeLabNumber = (e) => {
    this.setState({
      projectId: e.value,
      labNumber: e.label,
      labTypeName: '',
      facultyName: '',
      listDownloadFile: [],
    });
    let initialDownloadFile = [];
    Axios
      .get(`PublicDocMenuB/GetLabNumberWithDataB2/${e.value}`)
      .then((resp) => {
        if (resp.data.listDownloadFile != null) {
          initialDownloadFile = resp.data.listDownloadFile.map((ee) => {
            initialDownloadFile = [];
            return ee;
          });
        }
        this.setState({
          labTypeName: resp.data.labTypeName,
          facultyName: resp.data.facultyName,
          listDownloadFile: initialDownloadFile,
        });
      });
  }

  handleChangeAcronyms = (e) => {
    const { yearOfMeeting } = this.state;
    const runNumber = `${yearOfMeeting.toString().substring(2)}-${e.value}-XXX`;
    this.setState({
      acronyms: e.value,
      projectKeyNumber: runNumber,
    });
  }

  handleChangeInitialResult = (e) => {
    this.setState({ initialResult: e.value });
  }

  handleChangeYearOfMeeting = (e) => {
    this.setState({ yearOfMeeting: e.value });
  }

  handleChangeMeetingDate = (e) => {
    this.setState({ meetingDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleChangeFileDownloadId = (e) => {
    this.setState({ fileDownloadName: e.value });
    Axios
      .get(`PublicDocMenuB/GetDownloadFileByFileNameB2/${e.value}`)
      .then((resp) => {
        const url = window.atob(resp.data.filebase64);
        const a = document.createElement('a');
        a.href = url;
        a.download = e.label;
        a.click();
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicDocMenuB/AddDocMenuB2', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `
        ตรวจสอบเสนอและแจ้งผลเบื้องต้นเสร็จสิ้น!`);
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
      acceptType: '2',
      projectId: '',
      labNumber: '',
      labTypeName: '',
      facultyName: '',
      initialResult: '',
      fileDownloadName: '',
      projectKeyNumber: '',
      notes: '',
      acronyms: '',
      roundOfMeeting: '',
      yearOfMeeting: '',
      meetingDate: '',
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
      listLabNumber, listYearOfProject, listDownloadFile,
      acceptType, projectId, labTypeName,
      facultyName, initialResult, fileDownloadName,
      projectKeyNumber, notes, roundOfMeeting,
      yearOfMeeting, defaultYear, meetingDate,
      acronyms, buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    const defaultAcceptType = 'ประเมินห้องปฏิบัติการ';

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">ประเภทการรับรอง/การประเมิน</span>
                <div className="form__form-group-field">
                  <Field
                    name="acceptType"
                    component={renderSelectField}
                    value={acceptType}
                    onChange={this.handleChangeAcceptType}
                    placeholder={defaultAcceptType}
                    options={[
                      { value: '1', label: 'ขอเสนอโครงการ' },
                      { value: '2', label: 'ประเมินห้องปฏิบัติการ' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">รหัสหมายเลขห้องปฏิบัติการ</span>
                <span className="form__form-group-label" style={{ color: '#FF0000' }}> *</span>
                <div className="form__form-group-field">
                  <Field
                    name="projectId"
                    component={renderSelectField}
                    value={projectId}
                    onChange={this.handleChangeLabNumber}
                    options={listLabNumber}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ประเภทห้องปฏิบัติการ</span>
                <div className="form__form-group-field">
                  <Field
                    name="labTypeName"
                    component="input"
                    type="text"
                    placeholder={labTypeName}
                    maxLength={200}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ห้องปฏิบัติการประจำคณะ</span>
                <div className="form__form-group-field">
                  <Field
                    name="facultyName"
                    component="input"
                    type="text"
                    placeholder={facultyName}
                    maxLength={200}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">คำย่อประเภท</span>
                <div className="form__form-group-field">
                  <Field
                    name="acronyms"
                    component={renderSelectField}
                    value={acronyms}
                    onChange={this.handleChangeAcronyms}
                    options={[
                      { value: 'ABSL2', label: 'ABSL2' },
                      { value: 'BSL2', label: 'BSL2' },
                      { value: 'ABSL3', label: 'ABSL3' },
                      { value: 'BSL3', label: 'BSL3' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ผลตรวจสอบเบื้อต้น</span>
                <div className="form__form-group-field">
                  <Field
                    name="initialResult"
                    component={renderSelectField}
                    value={initialResult}
                    onChange={this.handleChangeInitialResult}
                    options={[
                      { value: '1', label: 'เอกสารครบถ้วน รับไว้พิจารณา' },
                      { value: '2', label: 'เอกสารไม่ครบถ้วน ตีกลับเพื่อแก้ไข' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ดาวน์โหลดข้อเสนอ </span>
                <span className="form__form-group-label" style={{ color: '#FF0000' }}> *</span>
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
                  กำหนดเลขสำคัญโครงการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="projectKeyNumber"
                    component="input"
                    type="text"
                    placeholder={projectKeyNumber}
                    onChange={this.handleChange}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  เหตุผลไม่รับไว้พิจารณา
                </span>
                <div className="form__form-group-field">
                  <textarea
                    name="notes"
                    component="input"
                    type="textarea"
                    value={notes}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  รอบประชุมเบื้องต้นครั้งที่
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="roundOfMeeting"
                    component="input"
                    type="number"
                    value={roundOfMeeting}
                    onChange={this.handleChange}
                  />
                  <span className="form__form-group-label">/</span>
                  <Field
                    name="yearOfMeeting"
                    component={renderSelectField}
                    value={yearOfMeeting}
                    placeholder={defaultYear}
                    onChange={this.handleChangeYearOfMeeting}
                    options={listYearOfProject}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  กำหนดวันที่ประชุม
                </span>
                <span className="form__form-group-label" style={{ color: '#FF0000' }}> *</span>
                <div className="form__form-group-field">
                  <Field
                    name="meetingDate"
                    component={renderDatePickerField}
                    selected={meetingDate}
                    onChange={this.handleChangeMeetingDate}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  หมายเหตุ : รอกรรมการยืนยัน
                </span>
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
  form: 'pages_b1_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
