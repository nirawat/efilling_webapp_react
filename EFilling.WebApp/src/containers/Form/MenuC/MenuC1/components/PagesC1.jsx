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
import renderMultiSelectField from '../../../../../shared/components/form/MultiSelect';
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

  constructor() {
    super();
    this.state = {
      listAssigner: [],
      listProjectNumber: [],
      listYearOfProject: [],
      listBoard: [],
      listSpecialList: [],
      defaultYear: '',
      roundOfMeeting: '',
      yearOfMeeting: '',
      meetingDate: '',
      assignerCode: eFillingSys.registerId,
      assignerName: eFillingSys.fullName,
      positionName: eFillingSys.positionName,
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      boardCodeArray: '',
      specialListCodeArray: '',
      acceptType: '1',
      permissionInsert: false,
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
      listSpecialList: [],
      defaultYear: '',
      yearOfMeeting: '',
    });
    let initialAssigner = [];
    let initialProjectNumber = [];
    let initialYear = [];
    let initialBoard = [];
    let initialSpecial = [];
    Axios
      .get(`PublicDocMenuC/MenuC1InterfaceData/${eFillingSys.registerId}/${eFillingSys.fullName}`)
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
        if (resp.data.listBoard != null) {
          initialSpecial = resp.data.listBoard.map((e) => {
            initialSpecial = [];
            return e;
          });
        }
        this.setState({
          listAssigner: initialAssigner,
          listProjectNumber: initialProjectNumber,
          listYearOfProject: initialYear,
          listBoard: initialBoard,
          listSpecialList: initialSpecial,
          roundOfMeeting: resp.data.defaultround,
          defaultYear: resp.data.defaultyear,
          yearOfMeeting: resp.data.defaultyear,
          permissionInsert: resp.data.userPermission.insert,
          assignerName: resp.data.default_assigner_name,
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
      window.location = '/efilling/forms/menuC/menuC1_2';
    }
    this.setState({ acceptType: e.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicDocMenuC/AddDocMenuC1', this.state)
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
      duration: 5,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  render() {
    const {
      listAssigner, listProjectNumber, listYearOfProject, listBoard, listSpecialList,
      assignerCode, assignerName, positionName, acceptType,
      projectNumber, projectHeadName, facultyName,
      projectNameThai, projectNameEng, boardCodeArray,
      roundOfMeeting, defaultYear, yearOfMeeting,
      specialListCodeArray, permissionInsert,
    } = this.state;

    const defaultAcceptType = 'คำขอรับรองโครงการ';

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
                      { value: '1', label: 'คำขอรับรองโครงการ' },
                      { value: '2', label: 'คำขอประเมินห้องปฏิบัติการ' },
                    ]}
                  />
                </div>
              </div>
              <div className="card__title">
                <h5 className="bold-text">ผู้มอบหมาย</h5>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ชื่อ-นามสกุล
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="assignerCode"
                    component={renderSelectField}
                    value={assignerCode}
                    placeholder={assignerName}
                    onChange={this.handleChangeAssigner}
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
                  <Field
                    name="boardCodeArray"
                    component={renderMultiSelectField}
                    value={boardCodeArray}
                    onChange={this.handleChangeBoard}
                    options={listBoard}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ผู้เชี่ยวชาญ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="specialListCodeArray"
                    component={renderMultiSelectField}
                    value={specialListCodeArray}
                    onChange={this.handleChangeSpecialListCode}
                    options={listSpecialList}
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
  form: 'pages_c1_1_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
