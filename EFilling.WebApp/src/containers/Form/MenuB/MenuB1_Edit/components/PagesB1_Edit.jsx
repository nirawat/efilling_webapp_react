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
const urlParams = new URLSearchParams(window.location.search);
let notificationRU = null;

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      docId: '',
      listProjectHead: [],
      listProjectNameThai: [],
      listYearOfProject: [],
      listDownloadFile: [],
      defaultUserName: '',
      defaultYear: '',
      acceptType: '1',
      projectHead: '',
      projectId: '',
      projectNameThai: '',
      projectNameEng: '',
      acronyms: '',
      initialResult: '',
      initialResultName: '',
      fileDownloadNameTitle: '',
      fileDownloadName: '',
      projectKeyNumber: '',
      notes: '',
      roundOfMeeting: '',
      yearOfMeeting: '',
      defaultMeetingDate: '',
      meetingDate: '',
      permissionEdit: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeMeetingDate = this.handleChangeMeetingDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      listProjectHead: [],
      listYearOfProject: [],
      listProjectNameThai: [],
      listDownloadFile: [],
    });
    let initialProjectHead = [];
    let initialYear = [];
    let initialProjectNameThai = [];
    let initialDownloadFile = [];
    Axios
      .get(`PublicDocMenuB/MenuB1InterfaceDataEdit/${urlParams.get('id')}/${eFillingSys.registerId}/${eFillingSys.fullName}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        initialProjectHead = resp.data.listProjectHead.map((e) => {
          initialProjectHead = [];
          return e;
        });
        initialYear = resp.data.listYearOfProject.map((e) => {
          initialYear = [];
          return e;
        });
        initialProjectNameThai = resp.data.listProjectNameThai.map((e) => {
          initialProjectNameThai = [];
          return e;
        });
        if (resp.data.listDownloadFile != null) {
          initialDownloadFile = resp.data.listDownloadFile.map((ee) => {
            initialDownloadFile = [];
            return ee;
          });
        }
        this.setState({
          listProjectHead: initialProjectHead,
          listYearOfProject: initialYear,
          listProjectNameThai: initialProjectNameThai,
          listDownloadFile: initialDownloadFile,
          docId: resp.data.editdata.docid,
          projectHead: resp.data.defaultuserid,
          defaultUserName: resp.data.defaultusername,
          defaultYear: resp.data.editdata.defaultyear,
          acceptType: resp.data.editdata.accepttype,
          projectId: resp.data.editdata.projectid,
          projectNameThai: resp.data.editdata.projectnamethai,
          projectNameEng: resp.data.editdata.projectnameeng,
          acronyms: resp.data.editdata.acronyms,
          initialResult: resp.data.editdata.initialresult,
          initialResultName: resp.data.editdata.initialresultname,
          fileDownloadNameTitle: resp.data.editdata.filedownloadnametitle,
          fileDownloadName: resp.data.editdata.filedownloadname,
          projectKeyNumber: resp.data.editdata.projectkeynumber,
          notes: resp.data.editdata.notes,
          roundOfMeeting: resp.data.editdata.roundofmeeting,
          yearOfMeeting: resp.data.editdata.defaultyear,
          defaultMeetingDate: resp.data.editdata.meetingdate,
          meetingDate: resp.data.editdata.meetingdate,
          permissionEdit: resp.data.userPermission.edit,
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeProjectHeader = (e) => {
    this.setState({
      projectHead: e.value,
      listProjectNameThai: [],
      listDownloadFile: [],
      projectId: '',
      projectNameEng: '',
      fileDownloadName: '',
    });
    let initialProjectNameThai = [];
    Axios
      .get(`PublicDocMenuB/GetAllProjectNameThai/${e.value}`)
      .then((resp) => {
        initialProjectNameThai = resp.data.map((ee) => {
          initialProjectNameThai = [];
          return ee;
        });
        this.setState({
          listProjectNameThai: initialProjectNameThai,
        });
      });
  }

  handleChangeProjectNameThai = (e) => {
    this.setState({
      projectId: e.value,
      projectNameEng: '',
      listDownloadFile: [],
      fileDownloadName: '',
    });
    let initialDownloadFile = [];
    Axios
      .get(`PublicDocMenuB/GetDataByProjectNameThai/${e.value}`)
      .then((resp) => {
        if (resp.data.listDownloadFile != null) {
          initialDownloadFile = resp.data.listDownloadFile.map((ee) => {
            initialDownloadFile = [];
            return ee;
          });
        }
        this.setState({
          projectNameEng: resp.data.projectnameeng,
          listDownloadFile: initialDownloadFile,
        });
      });
  }

  handleChangeInitialResult = (e) => {
    this.setState({ initialResult: e.value });
  }

  handleChangeFileDownloadId = (e) => {
    this.setState({
      fileDownloadName: e.value,
      fileDownloadNameTitle: e.label,
    });
    Axios
      .get(`PublicDocMenuB/GetAllDownloadFileByFileName/${e.value}`)
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

  handleChangeMeetingDate = (e) => {
    this.setState({ meetingDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicDocMenuB/UpdateDocMenuB1', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `
        ตรวจสอบเสนอและแจ้งผลเบื้องต้นเสร็จสิ้น!`);
        // this.handleReset();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
      acceptType: '1',
      projectHead: '',
      projectId: '',
      projectNameEng: '',
      acronyms: '',
      initialResult: '',
      fileDownloadName: '',
      projectKeyNumber: '',
      notes: '',
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
      listProjectHead, listProjectNameThai, listYearOfProject, listDownloadFile,
      acceptType, projectHead, projectId, projectNameThai, defaultUserName,
      projectNameEng, acronyms, initialResult, initialResultName, fileDownloadName, fileDownloadNameTitle,
      projectKeyNumber, notes, roundOfMeeting, yearOfMeeting, defaultMeetingDate, meetingDate,
      permissionEdit,
    } = this.state;

    const defaultAcceptType = 'ขอเสนอโครงการ';

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
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">หัวหน้าโครงการ</span>
                <div className="form__form-group-field">
                  <Field
                    name="projectHead"
                    component={renderSelectField}
                    value={projectHead}
                    onChange={this.handleChangeProjectHeader}
                    placeholder={defaultUserName}
                    options={listProjectHead}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ชื่อโครงการวิจัยไทย</span>
                <span className="form__form-group-label" style={{ color: '#FF0000' }}> *</span>
                <div className="form__form-group-field">
                  <Field
                    name="projectId"
                    component={renderSelectField}
                    value={projectId}
                    placeholder={projectNameThai}
                    options={listProjectNameThai}
                    onChange={this.handleChangeProjectNameThai}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ชื่อโครงการวิจัยอังกฤษ</span>
                <div className="form__form-group-field">
                  <Field
                    name="projectNameEng"
                    component="input"
                    type="text"
                    placeholder={projectNameEng}
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
                    component="input"
                    type="text"
                    placeholder={acronyms}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ผลตรวจสอบเบื้องต้น</span>
                <div className="form__form-group-field">
                  <Field
                    name="initialResult"
                    component={renderSelectField}
                    value={initialResult}
                    placeholder={initialResultName}
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
                    placeholder={fileDownloadNameTitle}
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
                  เหตุผลที่รับหรือไม่รับไว้พิจารณา
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
                    placeholder={roundOfMeeting}
                    onChange={this.handleChange}
                  />
                  <span className="form__form-group-label">/</span>
                  <Field
                    name="yearOfMeeting"
                    component={renderSelectField}
                    value={yearOfMeeting}
                    placeholder={yearOfMeeting}
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
                    name="defaultMeetingDate"
                    component="input"
                    type="text"
                    placeholder={defaultMeetingDate}
                    disabled
                  />
                  <Field
                    name="meetingDate"
                    component={renderDatePickerField}
                    defaultValue={meetingDate}
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
                  <Button color="success" type="submit" disabled={!permissionEdit}>บันทึก</Button>
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
