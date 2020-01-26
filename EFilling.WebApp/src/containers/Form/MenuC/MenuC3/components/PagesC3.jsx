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
import EyeIcon from 'mdi-react/EyeIcon';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderSelectField from '../../../../../shared/components/form/Select';
import renderMultiSelectField from '../../../../../shared/components/form/MultiSelect';
import renderDatePickerField from '../../../../../shared/components/form/DatePicker';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;
let counter = 0;

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      order: 'asc',
      orderBy: '',
      data: [],
      page: 0,
      rowsPerPage: 5,
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
      permissionInsert: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.historyReport();
    this.setState({
      listCommittees: [],
      listAttendees: [],
      listYearOfProject: [],
      defaultYear: '',
      roundOfMeeting: '',
      yearOfMeeting: '',
    });
    let initialCommittees = [];
    let initialAttendees = [];
    let initialYear = [];
    Axios
      .get(`PublicDocMenuC/MenuC3InterfaceData/${eFillingSys.registerId}`)
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
          defaultYear: resp.data.defaultyear,
          meetingRound: resp.data.defaultround,
          yearOfMeeting: resp.data.defaultyear,
          meetingDate: resp.data.defaultmeetingdate,
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

  handleChangeMeetingDate = (e) => {
    this.setState({ meetingDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicDocMenuC/AddDocMenuC3', this.state)
      .then((resp) => {
        this.show('success', 'บันทึก', `
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
      meetingRecordId: '',
      meetingRound: '',
      meetingLocation: '',
      meetingStart: '',
      meetingClose: '',
      committeesArray: '',
      attendeesArray: '',
    });
    reset();
  }

  // handleChangeMeetingDate = (e) => {
  // this.setState({ meetingDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  // }

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
      duration: 5,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  historyReport() {
    this.setState({
      data: [],
    });
    let tbRows = [];
    const rows = [];
    Axios
      .get('PublicDocMenuC/GetAllHistoryDataC3')
      .then((resp) => {
        if (resp.data != null) {
          tbRows = resp.data.map((e) => {
            tbRows = [];
            return e;
          });
        }
        for (let i = 0; i < tbRows.length; i += 1) {
          counter += 1;
          rows.push({
            id: counter,
            docid: tbRows[i].docid,
            yearofmeeting: tbRows[i].yearofmeeting,
            meetinground: tbRows[i].meetinground,
            meetingdate: tbRows[i].meetingdate,
            meetingrecordname: tbRows[i].meetingrecordname,
            meetinglocation: tbRows[i].meetinglocation,
            blank1: '',
            blank2: '',
            blank3: '',
            action: <EyeIcon />,
          });
        }
        this.setState({
          data: rows,
        });
      });
  }

  render() {
    const {
      meetingRecordId, meetingRound,
      listCommittees, listAttendees,
      committeesArray, attendeesArray,
      listYearOfProject, defaultYear,
      meetingLocation, meetingDate,
      meetingStart, meetingClose, permissionInsert,
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
                  <Field
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
                  <Field
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
                  <Field
                    name="committeesArray"
                    component={renderMultiSelectField}
                    value={committeesArray}
                    onChange={this.handleChangeCommitteesArray}
                    options={listCommittees}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">รายนามผู้ติดราชการ</span>
                <div className="form__form-group-field">
                  <Field
                    name="attendeesArray"
                    component={renderMultiSelectField}
                    value={attendeesArray}
                    onChange={this.handleChangeAttendees}
                    options={listAttendees}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <ButtonToolbar>
                  <Button color="success" type="submit" disabled={!permissionInsert}>บันทึก</Button>
                  <Button>ล้าง</Button>
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
