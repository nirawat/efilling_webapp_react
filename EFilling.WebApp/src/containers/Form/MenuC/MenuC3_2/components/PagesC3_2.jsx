import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
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

class PagesForm extends PureComponent {
  constructor() {
    super();
    this.state = {
      createBy: eFillingSys.registerId,
      listMeetingId: [],
      meetingId: '',
      meetingName: '',
      isFileAttachment: false,
      tab2Group1Seq1Input1: '',
      tab2Group1Seq1FileInput2: '',
      tab2Group1Seq1FileInput2Base64: '',
      tab2Group1Seq1Input3: '',
      tab2Group1Seq1Input4: '',
      tab2Group1Seq2Input1: '',
      tab2Group1Seq2FileInput2: '',
      tab2Group1Seq2FileInput2Base64: '',
      tab2Group1Seq2Input3: '',
      tab2Group1Seq2Input4: '',
      tab2Group1Seq3Input1: '',
      tab2Group1Seq3FileInput2: '',
      tab2Group1Seq3FileInput2Base64: '',
      tab2Group1Seq3Input3: '',
      tab2Group1Seq3Input4: '',
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
      .get(`PublicDocMenuC/MenuC32InterfaceData/${eFillingSys.registerId}`)
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
          isFileAttachment: resp.data.isFileAttachment,
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
      .post('/PublicDocMenuC/AddDocMenuC32', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `
        การประชุมระเบียบวาระที่ 2 เสร็จสิ้น!`);
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

  handleChangeMeetingId = (e) => {
    this.setState({
      meetingId: e.value,
      isFileAttachment: false,
    });
    Axios
      .get(`PublicDocMenuC/MenuC32CheckAttachment/${e.value}`)
      .then((resp) => {
        this.setState({
          isFileAttachment: resp.data,
        });
      });
  }

  handleChangeDownloadFileAllZip = () => {
    const {
      meetingId,
    } = this.state;
    Axios
      .get(`PublicDocMenuC/MenuC32DownloadAttachmentZip/${meetingId}`)
      .then((resp) => {
        if (resp.data === null) {
          this.show('warning', 'แจ้งให้ทราบ', 'ไม่พบไฟล์เอกสารแนบ!');
        } else {
          const url = resp.data.filebase64;
          const a = document.createElement('a');
          a.href = url;
          a.download = resp.data.filename;
          a.click();
        }
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

  handleChangeUploadFile1 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        tab2Group1Seq1FileInput2: e.name,
        tab2Group1Seq1FileInput2Base64: btoa(binaryString),
      });
    };
  }

  handleChangeUploadFile2 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        tab2Group1Seq2FileInput2: e.name,
        tab2Group1Seq2FileInput2Base64: btoa(binaryString),
      });
    };
  }

  handleChangeUploadFile3 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        tab2Group1Seq3FileInput2: e.name,
        tab2Group1Seq3FileInput2Base64: btoa(binaryString),
      });
    };
  }

  render() {
    const {
      listMeetingId, meetingName,
      tab2Group1Seq1Input1, tab2Group1Seq1FileInput2, tab2Group1Seq1Input3, tab2Group1Seq1Input4,
      tab2Group1Seq2Input1, tab2Group1Seq2FileInput2, tab2Group1Seq2Input3, tab2Group1Seq2Input4,
      tab2Group1Seq3Input1, tab2Group1Seq3FileInput2, tab2Group1Seq3Input3, tab2Group1Seq3Input4,
      buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
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
                <h5 className="bold-text">รับรองรายงานการประชุมครั้งที่ผ่านมา</h5>
              </div>
              <div className="form__form-group">
                <p style={{ backgroundColor: '#e6fff7' }}> เรื่องที่ 1</p>
              </div>
              <div className="form__form-group">
                <div className="form__form-group-field">
                  <Field
                    name="tab2Group1Seq1Input1"
                    component="input"
                    type="text"
                    value={tab2Group1Seq1Input1}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">อัพโหลดเอกสารที่เกี่ยวข้อง (ถ้ามี)</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab2Group1Seq1FileInput2"
                    component={renderFileInputField}
                    value={tab2Group1Seq1FileInput2}
                    onChange={this.handleChangeUploadFile1}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">สรุปเรื่อง</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab2Group1Seq1Input3"
                    component="input"
                    type="textarea"
                    value={tab2Group1Seq1Input3}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">มติ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab2Group1Seq1Input4"
                    component="input"
                    type="textarea"
                    value={tab2Group1Seq1Input4}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <p style={{ backgroundColor: '#e6fff7' }}> เรื่องที่ 2</p>
              </div>
              <div className="form__form-group">
                <div className="form__form-group-field">
                  <Field
                    name="tab2Group1Seq2Input1"
                    component="input"
                    type="text"
                    value={tab2Group1Seq2Input1}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">อัพโหลดเอกสารที่เกี่ยวข้อง (ถ้ามี)</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab2Group1Seq2FileInput2"
                    component={renderFileInputField}
                    value={tab2Group1Seq2FileInput2}
                    onChange={this.handleChangeUploadFile2}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">สรุปเรื่อง</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab2Group1Seq2Input3"
                    component="input"
                    type="textarea"
                    value={tab2Group1Seq2Input3}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">มติ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab2Group1Seq2Input4"
                    component="input"
                    type="textarea"
                    value={tab2Group1Seq2Input4}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <p style={{ backgroundColor: '#e6fff7' }}> เรื่องที่ 3</p>
              </div>
              <div className="form__form-group">
                <div className="form__form-group-field">
                  <Field
                    name="tab2Group1Seq3Input1"
                    component="input"
                    type="text"
                    value={tab2Group1Seq3Input1}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">อัพโหลดเอกสารที่เกี่ยวข้อง (ถ้ามี)</span>
                <div className="form__form-group-field">
                  <Field
                    name="tab2Group1Seq3FileInput2"
                    component={renderFileInputField}
                    value={tab2Group1Seq3FileInput2}
                    onChange={this.handleChangeUploadFile3}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">สรุปเรื่อง</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab2Group1Seq3Input3"
                    component="input"
                    type="textarea"
                    value={tab2Group1Seq3Input3}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">มติ</span>
                <div className="form__form-group-field">
                  <textarea
                    name="tab2Group1Seq3Input4"
                    component="input"
                    type="textarea"
                    value={tab2Group1Seq3Input4}
                    onChange={this.handleChange}
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
