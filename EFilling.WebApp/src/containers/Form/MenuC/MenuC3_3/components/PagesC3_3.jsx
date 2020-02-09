import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import EyeIcon from 'mdi-react/EyeIcon';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderSelectField from '../../../../../shared/components/form/Select';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;
let counter = 0;

class PagesForm extends PureComponent {
  constructor() {
    super();
    this.state = {
      createBy: eFillingSys.registerId,
      order: 'asc',
      orderBy: '',
      data: [],
      page: 0,
      rowsPerPage: 5,
      listMeetingId: [],
      listProjectNumberTab3: [],
      listApprovalTypeTab3: [],
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      meetingId: '',
      meetingName: '',
      agenda3ProjectCount: '0',
      agenda3ProjectNumber: '',
      agenda3ProjectNameThai: '',
      agenda3ProjectNameEng: '',
      agenda3AdvisorsName: '',
      agenda3Conclusion: '',
      agenda3ConclusionName: '',
      agenda3Suggestion: '',
      tab3Group1Seq1Input1: '',
      tab3Group1Seq1Input2: '',
      tab3Group1Seq1Input3: '',
      tab3Group1Seq2Input1: '',
      tab3Group1Seq2Input2: '',
      tab3Group1Seq2Input3: '',
      tab3Group1Seq3Input1: '',
      tab3Group1Seq3Input2: '',
      tab3Group1Seq3Input3: '',
      tab3Group2Seq1Input1: '',
      tab3Group2Seq1Input2: '',
      tab3Group2Seq1Input3: '',
      tab3Group2Seq2Input1: '',
      tab3Group2Seq2Input2: '',
      tab3Group2Seq2Input3: '',
      tab3Group2Seq3Input1: '',
      tab3Group2Seq3Input2: '',
      tab3Group2Seq3Input3: '',
      permissionInsert: false,
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.historyReport();
    this.setState({
      listMeetingId: [],
      meetingId: '',
      meetingName: '',
      listProjectNumberTab3: [],
      agenda3ProjectCount: '0',
    });
    let initialMeetingId = [];
    let initialProjectNumberTab3 = [];
    Axios
      .get(`PublicDocMenuC/MenuC33InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.listMeetingId != null) {
          initialMeetingId = resp.data.listMeetingId.map((e) => {
            initialMeetingId = [];
            return e;
          });
        }
        if (resp.data.listProjectNumberTab3 != null) {
          initialProjectNumberTab3 = resp.data.listProjectNumberTab3.map((e) => {
            initialProjectNumberTab3 = [];
            return e;
          });
        }
        this.setState({
          listMeetingId: initialMeetingId,
          meetingId: resp.data.meetingId,
          meetingName: resp.data.meetingName,
          listProjectNumberTab3: initialProjectNumberTab3,
          agenda3ProjectCount: initialProjectNumberTab3.length,
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicDocMenuC/AddDocMenuC33', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `
        การประชุมระเบียบวาระที่ 3 เสร็จสิ้น!`);
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

  handleChangeMeetingId = (e) => {
    this.setState({ meetingId: e.value });
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

  handleChangeProjectNumber3 = (e) => {
    this.setState({
      listApprovalTypeTab3: [],
      agenda3ProjectNumber: e.value,
      agenda3ProjectNameThai: '',
      agenda3ProjectNameEng: '',
      tab3Group1Seq1Input1: '',
      tab3Group1Seq1Input2: '',
      tab3Group1Seq1Input3: '',
      tab3Group1Seq2Input1: '',
      tab3Group1Seq2Input2: '',
      tab3Group1Seq2Input3: '',
      tab3Group1Seq3Input1: '',
      tab3Group1Seq3Input2: '',
      tab3Group1Seq3Input3: '',
    });
    let initialApprovalTypeTab3 = [];
    Axios
      .get(`PublicDocMenuC/GetProjectNumberWithDataC3Tab3/${e.value}`)
      .then((resp) => {
        if (resp.data.listApprovalType != null) {
          initialApprovalTypeTab3 = resp.data.listApprovalType.map((ee) => {
            initialApprovalTypeTab3 = [];
            return ee;
          });
        }
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
        this.setState({
          listApprovalTypeTab3: initialApprovalTypeTab3,
          agenda3ProjectNameThai: resp.data.projectnamethai,
          agenda3ProjectNameEng: resp.data.projectnameeng,
          tab3Group1Seq1Input1: resp.data.tab3Group1Seq1Input1,
          tab3Group1Seq1Input2: resp.data.tab3Group1Seq1Input2,
          tab3Group1Seq1Input3: resp.data.tab3Group1Seq1Input3,
          tab3Group1Seq2Input1: resp.data.tab3Group1Seq2Input1,
          tab3Group1Seq2Input2: resp.data.tab3Group1Seq2Input2,
          tab3Group1Seq2Input3: resp.data.tab3Group1Seq2Input3,
          tab3Group1Seq3Input1: resp.data.tab3Group1Seq3Input1,
          tab3Group1Seq3Input2: resp.data.tab3Group1Seq3Input2,
          tab3Group1Seq3Input3: resp.data.tab3Group1Seq3Input3,
        });
        return '';
      });
  }

  getTab3Conclusion = (e) => {
    this.setState({
      agenda3Conclusion: e.value,
      agenda3ConclusionName: e.label,
    });
  }

  historyReport() {
    this.setState({
      data: [],
    });
    let tbRows = [];
    const rows = [];
    Axios
      .get('PublicDocMenuC/GetAllHistoryDataC3Tab3')
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
            rptMeetingId: tbRows[i].rptMeetingId,
            rptMeetingTitle: tbRows[i].rptMeetingTitle,
            rptAgenda31: tbRows[i].rptAgenda31,
            rptProjectCount: tbRows[i].rptProjectCount,
            rptProjectNumber: tbRows[i].rptProjectNumber,
            rptProjectNameThai: tbRows[i].rptProjectNameThai,
            rptProjectNameEng: tbRows[i].rptProjectNameEng,
            rptConclusionName: tbRows[i].rptConclusionName,
            rptSuggestionName: tbRows[i].rptSuggestionName,
            rptApproval: <EyeIcon />,
            rptAgenda32: <EyeIcon />,
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
      listMeetingId, meetingName, project1Label, project2Label,
      listProjectNumberTab3, agenda3ProjectNumber,
      agenda3ProjectNameThai, agenda3ProjectNameEng, agenda3ProjectCount,
      agenda3Suggestion, agenda3Conclusion,
      buttonSaveEnable, buttonSaveStatus,
      tab3Group1Seq1Input1, tab3Group1Seq1Input2, tab3Group1Seq1Input3,
      tab3Group1Seq2Input1, tab3Group1Seq2Input2, tab3Group1Seq2Input3,
      tab3Group1Seq3Input1, tab3Group1Seq3Input2, tab3Group1Seq3Input3,
      tab3Group2Seq1Input1, tab3Group2Seq1Input2, tab3Group2Seq1Input3,
      tab3Group2Seq2Input1, tab3Group2Seq2Input2, tab3Group2Seq2Input3,
      tab3Group2Seq3Input1, tab3Group2Seq3Input2, tab3Group2Seq3Input3,
    } = this.state;


    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="card__title">
                <h5 className="bold-text">โครงการวิจัยที่รับรองหลังปรับปรุงแก้ไข</h5>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">วาระการประชุม (ครั้งที่)</span>
                <div className="form__form-group-field">
                  <Field
                    name="meetingId"
                    component={renderSelectField}
                    onChange={this.handleChangeMeetingId}
                    placeholder={meetingName}
                    options={listMeetingId}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">วาระที่ 3.1. โครงการที่ขอแก้ไขตามมติคณะกรรมการ</span>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">จำนวน (โครงการ)</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda3ProjectCount"
                    component="input"
                    type="text"
                    placeholder={agenda3ProjectCount}
                    disabled
                  />
                </div>
              </div>
              <div className="card__title">
                <h5 className="bold-text">เรื่อง</h5>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">เลขสำคัญโครงการ</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda3ProjectNumber"
                    value={agenda3ProjectNumber}
                    component={renderSelectField}
                    onChange={this.handleChangeProjectNumber3}
                    options={listProjectNumberTab3}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">{project1Label}</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda3ProjectNameThai"
                    component="input"
                    type="text"
                    placeholder={agenda3ProjectNameThai}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">{project2Label}</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda3ProjectNameEng"
                    component="input"
                    type="text"
                    placeholder={agenda3ProjectNameEng}
                    disabled
                  />
                </div>
              </div>
              <div className="card__title">
                <h5 className="bold-text">ความเห็นการรับรองของกรรมการผู้พิจารณา</h5>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ลำดับที่ 1 พิจารณาโดย</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab3Group1Seq1Input1"
                    component="input"
                    type="text"
                    placeholder={tab3Group1Seq1Input1}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นการรับรองของกรรมการผู้พิจารณา</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab3Group1Seq1Input2"
                    component="input"
                    type="text"
                    placeholder={tab3Group1Seq1Input2}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นประกอบการพิจารณาและข้อเสนอแนะ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab3Group1Seq1Input3"
                    component="input"
                    type="textarea"
                    placeholder={tab3Group1Seq1Input3}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ลำดับที่ 2 พิจารณาโดย</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab3Group1Seq2Input1"
                    component="input"
                    type="text"
                    placeholder={tab3Group1Seq2Input1}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นการรับรองของกรรมการผู้พิจารณา</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab3Group1Seq2Input2"
                    component="input"
                    type="text"
                    placeholder={tab3Group1Seq2Input2}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นประกอบการพิจารณาและข้อเสนอแนะ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab3Group1Seq2Input3"
                    component="input"
                    type="textarea"
                    placeholder={tab3Group1Seq2Input3}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ลำดับที่ 3 พิจารณาโดย</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab3Group1Seq3Input1"
                    component="input"
                    type="text"
                    placeholder={tab3Group1Seq3Input1}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นการรับรองของกรรมการผู้พิจารณา</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab3Group1Seq3Input2"
                    component="input"
                    type="text"
                    placeholder={tab3Group1Seq3Input2}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นประกอบการพิจารณาและข้อเสนอแนะ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab3Group1Seq3Input3"
                    component="input"
                    type="textarea"
                    placeholder={tab3Group1Seq3Input3}
                    disabled
                  />
                </div>
              </div>
              <div className="card__title">
                <h5 className="bold-text">มติที่ประชุม</h5>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">มติการรับรอง</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda3Conclusion"
                    component={renderSelectField}
                    value={agenda3Conclusion}
                    onChange={this.getTab3Conclusion}
                    options={[
                      { value: '2', label: 'รับรองงานวิจัย หลังจากปรับแก้ไข' },
                      { value: '3', label: 'รับรองงานวิจัย โดยให้ปรับแก้ไข (ตามมติคณะกรรมการ)' },
                      { value: '4', label: 'ยังไม่รับรอง' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">มติที่ประชุมพร้อมความเห็นประกอบการพิจารณาและข้อเสนอแนะ</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda3Suggestion"
                    component="textarea"
                    value={agenda3Suggestion}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="card__title">
                <h5 className="bold-text">วาระที่ 3.2 เรื่องสืบเนื่อง</h5>
              </div>
              <div className="form__form-group">
                <div className="form__form-group">
                  <h4 className="form__form-group-label">เรื่องที่</h4>
                  <div className="form__form-group-field">
                    <Field
                      name="tab3Group2Seq1Input1"
                      component="input"
                      type="text"
                      value={tab3Group2Seq1Input1}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">สรุปเรื่อง</span>
                  <div className="form__form-group-field">
                    <textarea
                      name="tab3Group2Seq1Input2"
                      component="input"
                      type="textarea"
                      value={tab3Group2Seq1Input2}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">มติ</span>
                  <div className="form__form-group-field">
                    <textarea
                      name="tab3Group2Seq1Input3"
                      component="input"
                      type="textarea"
                      value={tab3Group2Seq1Input3}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <h4 className="form__form-group-label">เรื่องที่</h4>
                  <div className="form__form-group-field">
                    <Field
                      name="tab3Group2Seq2Input1"
                      component="input"
                      type="text"
                      value={tab3Group2Seq2Input1}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">สรุปเรื่อง</span>
                  <div className="form__form-group-field">
                    <textarea
                      name="tab3Group2Seq2Input2"
                      component="input"
                      type="textarea"
                      value={tab3Group2Seq2Input2}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">มติ</span>
                  <div className="form__form-group-field">
                    <textarea
                      name="tab3Group2Seq2Input3"
                      component="input"
                      type="textarea"
                      value={tab3Group2Seq2Input3}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <h4 className="form__form-group-label">เรื่องที่</h4>
                  <div className="form__form-group-field">
                    <Field
                      name="tab3Group2Seq3Input1"
                      component="input"
                      type="text"
                      value={tab3Group2Seq3Input1}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">สรุปเรื่อง</span>
                  <div className="form__form-group-field">
                    <textarea
                      name="tab3Group2Seq3Input2"
                      component="input"
                      type="textarea"
                      value={tab3Group2Seq3Input2}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">มติ</span>
                  <div className="form__form-group-field">
                    <textarea
                      name="tab3Group2Seq3Input3"
                      component="input"
                      type="textarea"
                      value={tab3Group2Seq3Input3}
                      onChange={this.handleChange}
                    />
                  </div>
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
