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
let listApprovalList = null;

const listApprovalAll = [
  { value: '1', label: 'รับรองงานวิจัย' },
  { value: '3', label: 'รับรองงานวิจัย โดยให้ปรับแก้ไข (ตามมติคณะกรรมการ)' },
  { value: '4', label: 'ยังไม่รับรอง' },
];
const listApproval5 = [
  { value: '2', label: 'รับรองงานวิจัย หลังจากปรับแก้ไข' },
  { value: '3', label: 'รับรองงานวิจัย โดยให้ปรับแก้ไข (ตามมติคณะกรรมการ)' },
  { value: '4', label: 'ยังไม่รับรอง' },
];
const listApproval8 = [
  { value: '1', label: 'รับรองห้องปฏิบัติการ' },
  { value: '4', label: 'ยังไม่รับรอง' },
];

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      createBy: eFillingSys.registerId,
      listMeetingId: [],
      listApprovalTypeTab4: [],
      meetingId: '',
      meetingName: '',
      agenda4term: '',
      agenda4ProjectNumber: '',
      agenda4ProjectName1: '',
      agenda4ProjectName2: '',
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      agenda4Conclusion: '',
      agenda4ConclusionName: '',
      agenda4Suggestion: '',
      tab4Group1Seq1Input1: '',
      tab4Group1Seq1Input2: '',
      tab4Group1Seq1Input3: '',
      tab4Group1Seq2Input1: '',
      tab4Group1Seq2Input2: '',
      tab4Group1Seq2Input3: '',
      tab4Group1Seq3Input1: '',
      tab4Group1Seq3Input2: '',
      tab4Group1Seq3Input3: '',
      tab4Group1Seq4Input1: '',
      tab4Group1Seq4Input2: '',
      tab4Group1Seq4Input3: '',
      tab4Group1Seq5Input1: '',
      tab4Group1Seq5Input2: '',
      tab4Group1Seq5Input3: '',
      file1name: '',
      file1base64: '',
      permissionInsert: false,
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      listMeetingId: [],
      meetingId: '',
      meetingName: '',
    });
    let initialMeetingId = [];
    Axios
      .get(`PublicDocMenuC/MenuC34InterfaceData/${eFillingSys.registerId}`)
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
        this.setState({
          listMeetingId: initialMeetingId,
          meetingId: resp.data.meetingId,
          meetingName: resp.data.meetingName,
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
      .post('/PublicDocMenuC/AddDocMenuC34', this.state)
      .then(() => {
        this.show('success', 'บันทึก', `
        การประชุมระเบียบวาระที่ 4 เสร็จสิ้น!`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

  handleClickCommitteeComment = (e) => {
    this.setState({
      modalIsOpen: true,
      messageModel: '',
    });
    Axios
      .get(`PublicDocMenuHome/GetResultNoteHome1/${e}`)
      .then((resp) => {
        this.setState({
          modalIsOpen: true,
          messageModel: resp.data.resultNote,
        });
        return e;
      });
  }

  handleReset = () => {
    const { reset } = this.props;
    this.setState({
      modalIsOpen: true,
      messageNotes: '',
      meetingId: '',
      meetingName: '',
      agenda4term: '',
      agenda4ProjectNumber: '',
      agenda4ProjectName1: '',
      agenda4ProjectName2: '',
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      agenda4Conclusion: '',
      agenda4ConclusionName: '',
      agenda4Suggestion: '',
      tab4Group1Seq1Input1: '',
      tab4Group1Seq1Input2: '',
      tab4Group1Seq1Input3: '',
      tab4Group1Seq2Input1: '',
      tab4Group1Seq2Input2: '',
      tab4Group1Seq2Input3: '',
      tab4Group1Seq3Input1: '',
      tab4Group1Seq3Input2: '',
      tab4Group1Seq3Input3: '',
      tab4Group1Seq4Input1: '',
      tab4Group1Seq4Input2: '',
      tab4Group1Seq4Input3: '',
      tab4Group1Seq5Input1: '',
      tab4Group1Seq5Input2: '',
      tab4Group1Seq5Input3: '',
      file1name: '',
      file1base64: '',
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
      duration: 60,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  handleChangeAgendaTerm4 = (e) => {
    this.setState({
      agenda4term: e.value,
      listProjectNumberTab4: [],
      agenda4ProjectNumber: '',
      agenda4ProjectName1: '',
      agenda4ProjectName2: '',
      tab4Group1Seq1Input1: '',
      tab4Group1Seq1Input2: '',
      tab4Group1Seq1Input3: '',
      tab4Group1Seq2Input1: '',
      tab4Group1Seq2Input2: '',
      tab4Group1Seq2Input3: '',
      tab4Group1Seq3Input1: '',
      tab4Group1Seq3Input2: '',
      tab4Group1Seq3Input3: '',
      tab4Group1Seq4Input1: '',
      tab4Group1Seq4Input2: '',
      tab4Group1Seq4Input3: '',
      tab4Group1Seq5Input1: '',
      tab4Group1Seq5Input2: '',
      tab4Group1Seq5Input3: '',
    });
    if (e.value === '8') {
      this.setState({
        project1Label: 'ประเภทห้องปฏิบัติการ',
        project2Label: 'ห้องปฏิบัติการประจำคณะ',
      });
      listApprovalList = listApproval8;
    } else if (e.value === '6') {
      this.setState({
        project1Label: 'ชื่อโครงการภาษาไทย',
        project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      });
      listApprovalList = listApproval5;
    } else {
      this.setState({
        project1Label: 'ชื่อโครงการภาษาไทย',
        project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      });
      listApprovalList = listApprovalAll;
    }
    let initialProjectNumberTab4 = [];
    Axios
      .get(`PublicDocMenuC/GetAllProjectNumberTab4/${e.value}`)
      .then((resp) => {
        if (resp.data != null) {
          initialProjectNumberTab4 = resp.data.map((ee) => {
            initialProjectNumberTab4 = [];
            return ee;
          });
        }
        this.setState({
          listProjectNumberTab4: initialProjectNumberTab4,
        });
      });
  }

  handleChangeProjectNumber4 = (e) => {
    this.setState({
      agenda4ProjectNumber: e.value,
      agenda4ProjectName1: '',
      agenda4ProjectName2: '',
      tab4Group1Seq1Input1: '',
      tab4Group1Seq1Input2: '',
      tab4Group1Seq1Input3: '',
      tab4Group1Seq2Input1: '',
      tab4Group1Seq2Input2: '',
      tab4Group1Seq2Input3: '',
      tab4Group1Seq3Input1: '',
      tab4Group1Seq3Input2: '',
      tab4Group1Seq3Input3: '',
      tab4Group1Seq4Input1: '',
      tab4Group1Seq4Input2: '',
      tab4Group1Seq4Input3: '',
      tab4Group1Seq5Input1: '',
      tab4Group1Seq5Input2: '',
      tab4Group1Seq5Input3: '',
    });
    const { agenda4term } = this.state;
    let initialApprovalTypeTab4 = [];
    Axios
      .get(`PublicDocMenuC/GetProjectNumberWithDataC3Tab4/${agenda4term}/${e.value}`)
      .then((resp) => {
        if (resp.data.listApprovalType != null) {
          initialApprovalTypeTab4 = resp.data.listApprovalType.map((ee) => {
            initialApprovalTypeTab4 = [];
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
          listApprovalTypeTab4: initialApprovalTypeTab4,
          agenda4ProjectName1: resp.data.agenda4ProjectName1,
          agenda4ProjectName2: resp.data.agenda4ProjectName2,
          tab4Group1Seq1Input1: resp.data.tab4Group1Seq1Input1,
          tab4Group1Seq1Input2: resp.data.tab4Group1Seq1Input2,
          tab4Group1Seq1Input3: resp.data.tab4Group1Seq1Input3,
          tab4Group1Seq2Input1: resp.data.tab4Group1Seq2Input1,
          tab4Group1Seq2Input2: resp.data.tab4Group1Seq2Input2,
          tab4Group1Seq2Input3: resp.data.tab4Group1Seq2Input3,
          tab4Group1Seq3Input1: resp.data.tab4Group1Seq3Input1,
          tab4Group1Seq3Input2: resp.data.tab4Group1Seq3Input2,
          tab4Group1Seq3Input3: resp.data.tab4Group1Seq3Input3,
          tab4Group1Seq4Input1: resp.data.tab4Group1Seq4Input1,
          tab4Group1Seq4Input2: resp.data.tab4Group1Seq4Input2,
          tab4Group1Seq4Input3: resp.data.tab4Group1Seq4Input3,
          tab4Group1Seq5Input1: resp.data.tab4Group1Seq5Input1,
          tab4Group1Seq5Input2: resp.data.tab4Group1Seq5Input2,
          tab4Group1Seq5Input3: resp.data.tab4Group1Seq5Input3,
        });
        return '';
      });
  }

  getTab4Conclusion = (e) => {
    this.setState({
      agenda4Conclusion: e.value,
      agenda4ConclusionName: e.label,
    });
  }

  handleChangeFile1 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        file1name: e.name,
        file1base64: btoa(binaryString),
      });
    };
  }

  render() {
    const {
      listMeetingId, meetingName,
      listProjectNumberTab4, agenda4term, agenda4ProjectNumber,
      agenda4ProjectName1, agenda4ProjectName2,
      agenda4Suggestion, agenda4Conclusion,
      project1Label, project2Label, file1name,
      buttonSaveEnable, buttonSaveStatus,
      tab4Group1Seq1Input1, tab4Group1Seq1Input2, tab4Group1Seq1Input3,
      tab4Group1Seq2Input1, tab4Group1Seq2Input2, tab4Group1Seq2Input3,
      tab4Group1Seq3Input1, tab4Group1Seq3Input2, tab4Group1Seq3Input3,
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
              <div className="card__title">
                <h5 className="bold-text">เรื่องเสนอเพื่อพิจารณา</h5>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">วาระที่ 4</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda4term"
                    component={renderSelectField}
                    value={agenda4term}
                    onChange={this.handleChangeAgendaTerm4}
                    options={[
                      { value: '1', label: '1.โครงการใหม่ที่เป็น-ความเสี่ยงประเภท 1' },
                      { value: '2', label: '2.โครงการใหม่ที่เป็น-ความเสี่ยงประเภท 2' },
                      { value: '3', label: '3.โครงการใหม่ที่เป็น-ความเสี่ยงประเภท 3' },
                      { value: '4', label: '4.โครงการใหม่ที่เป็น-ความเสี่ยงประเภท 4' },
                      { value: '5', label: '5.โครงการที่เป็น-แจ้งขอต่ออายุใบรับรอง' },
                      { value: '6', label: '6.โครงการที่เป็น-แก้ไขโครงการที่ผ่านการรับรองแล้ว' },
                      { value: '7', label: '7.โครงการที่เป็น-แจ้งปิดโครงการ' },
                      { value: '8', label: '8.คำขอประเมินห้องปฏิบัติการ' },
                      { value: '9', label: '9.ผลการตรวจเยี่ยมติดตามโครงการ' },
                    ]}
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
                    name="agenda4ProjectNumber"
                    value={agenda4ProjectNumber}
                    component={renderSelectField}
                    onChange={this.handleChangeProjectNumber4}
                    options={listProjectNumberTab4}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">{project1Label}</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda4ProjectName1"
                    component="input"
                    type="text"
                    placeholder={agenda4ProjectName1}
                    maxLength={200}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">{project2Label}</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda4ProjectName2"
                    component="input"
                    type="text"
                    placeholder={agenda4ProjectName2}
                    maxLength={200}
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
                    name="tab4Group1Seq1Input1"
                    component="input"
                    type="text"
                    placeholder={tab4Group1Seq1Input1}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นการรับรองของกรรมการผู้พิจารณา</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab4Group1Seq1Input2"
                    component="input"
                    type="text"
                    placeholder={tab4Group1Seq1Input2}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นประกอบการพิจารณาและข้อเสนอแนะ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab4Group1Seq1Input3"
                    component="input"
                    type="textarea"
                    placeholder={tab4Group1Seq1Input3}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ลำดับที่ 2 พิจารณาโดย</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab4Group1Seq2Input1"
                    component="input"
                    type="text"
                    placeholder={tab4Group1Seq2Input1}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นการรับรองของกรรมการผู้พิจารณา</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab4Group1Seq2Input2"
                    component="input"
                    type="text"
                    placeholder={tab4Group1Seq2Input2}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นประกอบการพิจารณาและข้อเสนอแนะ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab4Group1Seq2Input3"
                    component="input"
                    type="textarea"
                    placeholder={tab4Group1Seq2Input3}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ลำดับที่ 3 พิจารณาโดย</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab4Group1Seq3Input1"
                    component="input"
                    type="text"
                    placeholder={tab4Group1Seq3Input1}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นการรับรองของกรรมการผู้พิจารณา</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab4Group1Seq3Input2"
                    component="input"
                    type="text"
                    placeholder={tab4Group1Seq3Input2}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นประกอบการพิจารณาและข้อเสนอแนะ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab4Group1Seq3Input3"
                    component="input"
                    type="textarea"
                    placeholder={tab4Group1Seq3Input3}
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
                    name="agenda4Conclusion"
                    component={renderSelectField}
                    value={agenda4Conclusion}
                    onChange={this.getTab4Conclusion}
                    options={listApprovalList}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">มติที่ประชุมพร้อมความเห็นประกอบการพิจารณาและข้อเสนอแนะ</span>
                <div className="form__form-group-field">
                  <Field
                    name="agenda4Suggestion"
                    component="textarea"
                    value={agenda4Suggestion}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">อัพโหลดเอกสารที่เกี่ยวข้อง (ถ้ามี)</span>
                <div className="form__form-group-field">
                  <Field
                    id="file1name"
                    name="file1name"
                    component={renderFileInputField}
                    value={file1name}
                    onChange={this.handleChangeFile1}
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
