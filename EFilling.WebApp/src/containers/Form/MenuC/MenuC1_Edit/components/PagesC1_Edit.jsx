import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderSelectField from '../../../../../shared/components/form/Select';
import renderDatePickerField from '../../../../../shared/components/form/DatePicker';


Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const urlParams = new URLSearchParams(window.location.search);
const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      createBy: eFillingSys.registerId,
      listAssigner: [],
      listProjectNumber: [],
      listYearOfProject: [],
      listBoard: [],
      docId: '',
      defaultYear: '',
      roundOfMeeting: '',
      yearOfMeeting: '',
      meetingDate: '',
      assignerCode: '',
      assignerName: '',
      positionName: '',
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      boardCodeArray: '',
      specialListCodeArray: '',
      acceptType: '1',
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeProjectNumber = this.handleChangeProjectNumber.bind(this);
    this.handleChangeAssigner = this.handleChangeAssigner.bind(this);
    this.handleChangeBoard = this.handleChangeBoard.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      listAssigner: [],
      listProjectNumber: [],
      listYearOfProject: [],
      listBoard: [],
      boardCodeArray: '',
      specialListCodeArray: '',
    });
    let initialAssigner = [];
    let initialProjectNumber = [];
    let initialYear = [];
    let initialBoard = [];
    let initialBoardCodeArray = '';
    let initialSpecialListCodeArray = '';
    Axios
      .get(`PublicDocMenuC/MenuC1InterfaceDataEdit/${urlParams.get('id')}/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.listAssigner != null) {
          initialAssigner = resp.data.listAssigner.map((e) => {
            initialAssigner = [];
            return e;
          });
        }
        if (resp.data.listProjectNumber != null) {
          initialProjectNumber = resp.data.listProjectNumber.map((e) => {
            initialProjectNumber = [];
            return e;
          });
        }
        initialYear = resp.data.listYearOfProject.map((e) => {
          initialYear = [];
          return e;
        });
        if (resp.data.listBoard != null) {
          initialBoard = resp.data.listBoard.map((e) => {
            initialBoard = [];
            return e;
          });
        }
        if (resp.data.editdata.boardcodearray != null) {
          initialBoardCodeArray = resp.data.editdata.boardcodearray.map((e) => {
            initialBoardCodeArray = [];
            return e;
          });
        }
        if (resp.data.editdata.speciallistcodearray != null) {
          initialSpecialListCodeArray = resp.data.editdata.speciallistcodearray.map((e) => {
            initialSpecialListCodeArray = [];
            return e;
          });
        }
        this.setState({
          listAssigner: initialAssigner,
          listProjectNumber: initialProjectNumber,
          listYearOfProject: initialYear,
          listBoard: initialBoard,
          docId: resp.data.editdata.docid,
          defaultYear: resp.data.editdata.yearofmeeting,
          roundOfMeeting: resp.data.editdata.roundofmeeting,
          yearOfMeeting: resp.data.editdata.yearofmeeting,
          meetingDate: resp.data.editdata.meetingdate,
          assignerCode: resp.data.editdata.assignercode,
          assignerName: resp.data.editdata.assignername,
          positionName: resp.data.editdata.positionname,
          projectNumber: resp.data.editdata.projectnumber,
          projectHeadName: resp.data.editdata.projectheadname,
          facultyName: resp.data.editdata.facultyname,
          projectNameThai: resp.data.editdata.projectnamethai,
          projectNameEng: resp.data.editdata.projectnameeng,
          acceptType: resp.data.editdata.acceptType,
          boardCodeArray: initialBoardCodeArray,
          specialListCodeArray: initialSpecialListCodeArray,
          buttonSaveEnable: resp.data.editdata.editenable,
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicDocMenuC/UpdateDocMenuC1Edit', this.state)
      .then((resp) => {
        this.show('success', 'บันทึก', `
        การมอบหมายผู้พิจารณาโครงการเสร็จสิ้น!`);
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
        this.setState({
          buttonSaveStatus: 'บันทึก',
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
      roundOfMeeting: '',
      meetingDate: '',
      assignerCode: '',
      positionName: '',
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      boardCodeArray: '',
      specialListCodeArray: '',
      acceptType: '1',
    });
    reset();
  }

  handleChangeMeetingDate = (e) => {
    this.setState({ meetingDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleChangeAssigner = (e) => {
    this.setState({ assignerCode: e.value });
    Axios
      .get(`PublicDocMenuC/GetRegisterUserData/${e.value}`)
      .then((resp) => {
        this.setState({
          positionName: resp.data.positionname,
        });
        return '';
      })
      .catch(() => {
        this.setState({
          positionName: '',
        });
      });
  }

  handleChangeProjectNumber = (e) => {
    this.setState({ projectNumber: e.value });
    Axios
      .get(`PublicDocMenuC/GetProjectNumberWithDataC1/${e.value}`)
      .then((resp) => {
        this.setState({
          projectHeadName: resp.data.projectheadname,
          facultyName: resp.data.facultyname,
          projectNameThai: resp.data.projectnamethai,
          projectNameEng: resp.data.projectnameeng,
        });
        return '';
      })
      .catch(() => {
        this.setState({
          projectHeadName: '',
          facultyName: '',
          projectNameThai: '',
          projectNameEng: '',
        });
      });
  }

  handleChangeBoard = (e) => {
    this.setState({ boardCodeArray: e });
  }

  handleChangeSpecialListCode = (e) => {
    this.setState({ specialListCodeArray: e });
  }

  handleChangeYearOfMeeting = (e) => {
    this.setState({ yearOfMeeting: e.value });
    Axios
      .get(`PublicDocMenuC/GetDefaultRoundC1/${e.value}`)
      .then((resp) => {
        this.setState({
          roundOfMeeting: resp.data.count,
        });
        return '';
      })
      .catch(() => {
        this.setState({
          roundOfMeeting: '',
        });
      });
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

  handlePrintReport = () => {
    const { docId } = this.state;
    Axios
      .get(`PublicDocMenuReport/GetReportR11/${docId}`)
      .then((resp) => {
        if (resp.data !== null) {
          const url = resp.data.filebase64;
          const a = document.createElement('a');
          a.href = url;
          a.download = resp.data.filename;
          a.click();
        }
      });
  }

  render() {
    const {
      listAssigner, listProjectNumber, listYearOfProject, listBoard,
      assignerCode, assignerName, positionName, acceptType, meetingDate,
      projectNumber, projectHeadName, facultyName,
      projectNameThai, projectNameEng, boardCodeArray,
      roundOfMeeting, defaultYear, yearOfMeeting, specialListCodeArray,
      buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    const defaultAcceptType = 'คำขอรับรองโครงการ';

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <div className="form__form-group">
              <span className="form__form-group-label">ประเภทการรับรอง/การประเมิน</span>
              <div className="form__form-group-field">
                <Field
                  name="acceptType"
                  component={renderSelectField}
                  value={acceptType}
                  placeholder={defaultAcceptType}
                  options={[
                    { value: '1', label: 'คำขอรับรองโครงการ' },
                  ]}
                />
              </div>
            </div>
            <div className="card__title">
              <h5 className="bold-text">ผู้มอบหมาย</h5>
            </div>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ชื่อ-นามสกุล
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="assignerCode"
                    component={renderSelectField}
                    value={assignerCode}
                    onChange={this.handleChangeAssigner}
                    placeholder={assignerName}
                    options={listAssigner}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ตำแหน่งในคณะกรรมการ</span>
                <div className="form__form-group-field">
                  <Field
                    name="positionName"
                    component="input"
                    type="text"
                    placeholder={positionName}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ครั้งที่ประชุม
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="roundOfMeeting"
                    component="input"
                    type="number"
                    value={roundOfMeeting}
                    onChange={this.handleChange}
                    placeholder={roundOfMeeting}
                    disabled
                  />
                  <span className="form__form-group-label">/</span>
                  <Field
                    name="yearOfMeeting"
                    component={renderSelectField}
                    onChange={this.handleChangeYearOfMeeting}
                    value={yearOfMeeting}
                    placeholder={defaultYear}
                    options={listYearOfProject}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่ประชุม
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="defaultMeetingDate"
                    component="input"
                    type="text"
                    placeholder={meetingDate}
                    disabled
                  />
                  <Field
                    name="meetingDate"
                    component={renderDatePickerField}
                    onChange={this.handleChangeMeetingDate}
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
                    placeholder={projectNameThai}
                    options={listProjectNumber}
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
                <span className="form__form-group-label">
                  ชื่อโครงการภาษาไทย
                </span>
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
                <span className="form__form-group-label">
                  ชื่อโครงการภาษาอังกฤษ
                </span>
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
                  คณะกรรมการ
                </span>
                <div className="form__form-group-field">
                  <Select
                    isMulti
                    name="boardCodeArray"
                    value={boardCodeArray}
                    onChange={this.handleChangeBoard}
                    options={listBoard}
                    clearable={false}
                    closeOnSelect={false}
                    removeSelected={false}
                    className="react-select"
                    classNamePrefix="react-select"
                    isDisabled={!buttonSaveEnable}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ผู้เชี่ยวชาญ
                </span>
                <div className="form__form-group-field">
                  <Select
                    isMulti
                    name="specialListCodeArray"
                    value={specialListCodeArray}
                    onChange={this.handleChangeSpecialListCode}
                    options={listBoard}
                    clearable={false}
                    closeOnSelect={false}
                    removeSelected={false}
                    className="react-select"
                    classNamePrefix="react-select"
                    isDisabled={!buttonSaveEnable}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <ButtonToolbar>
                  <Button color="success" type="submit" disabled={!buttonSaveEnable}>{buttonSaveStatus}</Button>
                  <Button color="success" onClick={() => this.handlePrintReport()}>พิมพ์</Button>
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
  form: 'pages_c1_1_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
