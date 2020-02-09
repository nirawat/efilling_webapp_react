import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
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

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
const urlParams = new URLSearchParams(window.location.search);
let notificationRU = null;

class PagesForm extends PureComponent {
  constructor() {
    super();
    this.state = {
      createBy: eFillingSys.registerId,
      docId: '',
      listCommittees: [],
      listAttendees: [],
      listYearOfProject: [],
      defaultYear: '',
      yearOfMeeting: '',
      meetingDate: '',
      meetingRecordId: '',
      meetingRound: '',
      meetingLocation: '',
      meetingStart: '',
      meetingClose: '',
      committeesArray: '',
      attendeesArray: '',
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      listCommittees: [],
      listAttendees: [],
      listYearOfProject: [],
    });
    let initialCommittees = [];
    let initialAttendees = [];
    let initialYear = [];
    Axios
      .get(`PublicDocMenuC/MenuC3EditInterfaceData/${eFillingSys.registerId}/${urlParams.get('id')}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.listCommittees != null) {
          initialCommittees = resp.data.listCommittees.map((e) => {
            initialCommittees = [];
            return e;
          });
        }
        if (resp.data.listAttendees != null) {
          initialAttendees = resp.data.listAttendees.map((e) => {
            initialAttendees = [];
            return e;
          });
        }
        initialYear = resp.data.listYearOfProject.map((e) => {
          initialYear = [];
          return e;
        });
        this.setState({
          listCommittees: initialCommittees,
          listAttendees: initialAttendees,
          listYearOfProject: initialYear,
          docId: resp.data.editdata.docid,
          defaultYear: resp.data.editdata.yearofmeeting,
          meetingRound: resp.data.editdata.meetinground,
          yearOfMeeting: resp.data.editdata.yearofmeeting,
          meetingDate: resp.data.editdata.meetingdate,
          meetingRecordId: resp.data.editdata.meetingrecordid,
          meetingLocation: resp.data.editdata.meetinglocation,
          meetingStart: resp.data.editdata.meetingstart,
          meetingClose: resp.data.editdata.meetingclose,
          committeesArray: resp.data.editdata.committeesarray,
          attendeesArray: resp.data.editdata.attendeesarray,
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

  handleChangeMeetingDate = (e) => {
    this.setState({ meetingDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicDocMenuC/UpdateDocMenuC3Edit', this.state)
      .then((resp) => {
        this.show('success', 'แจ้งให้ทราบ', `
        กำหนดวาระการประชุมเสร็จสิ้น!`);
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
            this.show('danger', 'ข้อผิดผลาด!', error.response.data.message);
          } else {
            this.show('danger', 'Error', error.message);
          }
        } else {
          this.show('danger', 'Error', error.message);
        }
      });
  }

  handleChangeMeetingDate = (e) => {
    this.setState({ meetingDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleChangeMeetingRecordId = (e) => {
    this.setState({ meetingRecordId: e.value });
  }

  handleChangeYearOfMeeting = (e) => {
    this.setState({ yearOfMeeting: e.value });
    Axios
      .get(`PublicDocMenuC/GetDefaultRoundC3/${e.value}`)
      .then((resp) => {
        this.setState({
          meetingRound: resp.data.count,
          meetingDate: resp.data.meetingDate,
        });
        return '';
      })
      .catch(() => {
        this.setState({
          meetingRound: '',
          meetingDate: '',
        });
      });
  }

  handleChangeCommitteesArray = (e) => {
    this.setState({ committeesArray: e });
  }

  handleChangeAttendees = (e) => {
    this.setState({ attendeesArray: e });
  }

  show = (color, title, message) => {
    notificationRU.notice({
      content: <BasicNotification
        color={color}
        title={title}
        message={message}
      />,
      duration: 20,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  render() {
    const {
      meetingRecordId, meetingRound,
      listCommittees, listAttendees,
      committeesArray, attendeesArray,
      listYearOfProject, defaultYear,
      meetingLocation, meetingDate,
      meetingStart, meetingClose,
      buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">แบบบันทึกการประชุม</span>
                <div className="form__form-group-field">
                  <Field
                    name="meetingRecordId"
                    component={renderSelectField}
                    value={meetingRecordId}
                    onChange={this.handleChangeMeetingRecordId}
                    placeholder={meetingRecordId === 1 ? 'รายงานการประชุมคณะกรรมการพิจารณาฯความปลอดภัยทางชีวภาพ' : 'ระเบียบวาระการประชุมคณะกรรมการพิจารณาฯความปลอดภัยทางชีวภาพ'}
                    options={[
                      { value: '1', label: 'รายงานการประชุมคณะกรรมการพิจารณาฯความปลอดภัยทางชีวภาพ' },
                      { value: '2', label: 'ระเบียบวาระการประชุมคณะกรรมการพิจารณาฯความปลอดภัยทางชีวภาพ' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ประชุมครั้งที่</span>
                <div className="form__form-group-field">
                  <Field
                    name="meetingRound"
                    component="input"
                    type="number"
                    value={meetingRound}
                    onChange={this.handleChange}
                    placeholder={meetingRound}
                    disabled
                  />
                  <span className="form__form-group-label">/</span>
                  <Field
                    name="yearOfMeeting"
                    component={renderSelectField}
                    onChange={this.handleChangeYearOfMeeting}
                    placeholder={defaultYear}
                    options={listYearOfProject}
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
                    placeholder={meetingDate}
                    component={renderDatePickerField}
                    onChange={this.handleChangeMeetingDate}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">เริ่มประชุมเวลา</span>
                <div className="form__form-group-field">
                  <input
                    name="meetingStart"
                    component="input"
                    type="text"
                    value={meetingStart}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ปิดประชุมเวลา</span>
                <div className="form__form-group-field">
                  <input
                    name="meetingClose"
                    component="input"
                    type="text"
                    value={meetingClose}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">สถานที่ประชุม</span>
                <div className="form__form-group-field">
                  <textarea
                    name="meetingLocation"
                    component="input"
                    type="textarea"
                    value={meetingLocation}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">รายชื่อกรรมการผู้เข้าร่วมประชุม</span>
                <div className="form__form-group-field">
                  <Select
                    isMulti
                    name="committeesArray"
                    value={committeesArray}
                    onChange={this.handleChangeCommitteesArray}
                    options={listCommittees}
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
                <span className="form__form-group-label">รายนามผู้ติดราชการ</span>
                <div className="form__form-group-field">
                  <Select
                    isMulti
                    name="attendeesArray"
                    value={attendeesArray}
                    onChange={this.handleChangeAttendees}
                    options={listAttendees}
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
