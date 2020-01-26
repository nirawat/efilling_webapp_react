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
      fileDownloadName: '',
      projectKeyNumber: '',
      notes: '',
      roundOfMeeting: '',
      yearOfMeeting: '',
      meetingDate: '',
      permissionInsert: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAcceptType = this.handleChangeAcceptType.bind(this);
    this.handleChangeProjectHeader = this.handleChangeProjectHeader.bind(this);
    this.handleChangeProjectNameThai = this.handleChangeProjectNameThai.bind(this);
    this.handleChangeAcronyms = this.handleChangeAcronyms.bind(this);
    this.handleChangeInitialResult = this.handleChangeInitialResult.bind(this);
    this.handleChangeFileDownloadId = this.handleChangeFileDownloadId.bind(this);
    this.handleChangeMeetingDate = this.handleChangeMeetingDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      listProjectHead: [],
      listYearOfProject: [],
      listProjectNameThai: [],
      defaultUserName: '',
      projectHead: '',
    });
    let initialProjectHead = [];
    let initialYear = [];
    let initialProjectNameThai = [];
    Axios
      .get(`PublicDocMenuB/MenuB1InterfaceData/${eFillingSys.registerId}/${eFillingSys.fullName}`)
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
        if (resp.data.listProjectNameThai !== null) {
          initialProjectNameThai = resp.data.listProjectNameThai.map((e) => {
            initialProjectNameThai = [];
            return e;
          });
        }
        this.setState({
          listProjectHead: initialProjectHead,
          listYearOfProject: initialYear,
          defaultYear: resp.data.defaultyear,
          yearOfMeeting: resp.data.defaultyear,
          defaultUserName: resp.data.defaultusername,
          projectHead: resp.data.defaultuserid,
          listProjectNameThai: initialProjectNameThai,
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

  handleChangeAcceptType = (e) => {
    if (e.value === '2') {
      window.location = '/efilling/forms/menuB/menuB2';
    }
    this.setState({ acceptType: e.value });
  }

  handleChangeProjectHeader = (e) => {
    this.setState({
      projectHead: e.value,
      listProjectNameThai: [],
      listDownloadFile: [],
      projectId: '',
      projectNameThai: '',
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
      projectNameThai: '',
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
          projectNameThai: resp.data.projectnamethai,
          projectNameEng: resp.data.projectnameeng,
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

  handleChangeFileDownloadId = (e) => {
    this.setState({ fileDownloadName: e.value });
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
      .post('/PublicDocMenuB/AddDocMenuB1', this.state)
      .then((resp) => {
        this.show('success', 'แจ้งให้ทราบ', `
        ตรวจสอบเสนอและแจ้งผลเบื้องต้นเสร็จสิ้น!
        หมายเลขเอกสารของท่านคือ ${resp.data.docNumber}`);
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
      acceptType, projectHead, projectId, defaultUserName,
      projectNameEng, acronyms, initialResult, fileDownloadName,
      projectKeyNumber, notes, roundOfMeeting, yearOfMeeting, defaultYear, meetingDate,
      permissionInsert,
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
                      { value: '2', label: 'ประเมินห้องปฏิบัติการ' },
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
                    component={renderSelectField}
                    value={acronyms}
                    onChange={this.handleChangeAcronyms}
                    options={[
                      { value: 'GM', label: 'GM' },
                      { value: 'MI', label: 'MI' },
                      { value: 'AV', label: 'AV' },
                      { value: 'OT', label: 'OT' },
                    ]}
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
  form: 'pages_b1_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
