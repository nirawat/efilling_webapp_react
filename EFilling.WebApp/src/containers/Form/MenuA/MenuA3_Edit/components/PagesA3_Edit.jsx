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
import renderDatePickerDefauleValueField from '../../../../../shared/components/form/DatePickerDefaultValue';
import renderSelectField from '../../../../../shared/components/form/Select';
import renderFileInputField from '../../../../../shared/components/form/FileInput';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const urlParams = new URLSearchParams(window.location.search);
const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;

class PagesForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createBy: eFillingSys.registerId,
      projectList: [],
      docId: '',
      project1Label: 'ชื่อโครงการภาษาไทย',
      project2Label: 'ชื่อโครงการภาษาอังกฤษ',
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      acceptTypeNameThai: '',
      file1Name: '',
      file1Base64: '',
      conclusionDate: '',
      permissionEdit: false,
    };

    this.handleChangeFile1 = this.handleChangeFile1.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    let initialProjectNumber = [];
    Axios
      .get(`PublicDocMenuA/MenuA3EditInterfaceData/${eFillingSys.registerId}/${urlParams.get('id')}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        initialProjectNumber = resp.data.listProjectNumber.map((e) => {
          initialProjectNumber = [];
          return e;
        });
        this.setState({
          projectList: initialProjectNumber,
          docId: resp.data.editdata.docid,
          projectNumber: resp.data.editdata.projectnumber,
          projectHeadName: resp.data.editdata.projectheadname,
          facultyName: resp.data.editdata.facultyname,
          projectNameThai: resp.data.editdata.projectnamethai,
          projectNameEng: resp.data.editdata.projectnameeng,
          acceptTypeNameThai: resp.data.editdata.accepttypenamethai,
          conclusionDate: resp.data.editdata.conclusiondate,
          permissionEdit: resp.data.userPermission.edit,
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChangeFile1 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        file1Name: e.name,
        file1Base64: btoa(binaryString),
      });
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicDocMenuA/AddDocMenuA3', this.state)
      .then((resp) => {
        this.show('success', 'แจ้งให้ทราบ', `บันทึกเอกสาร
        รายงานความก้าวหน้าโครงการเสร็จสิ้น!`);
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

  handlePrintReport = () => {
    const { docId } = this.state;
    Axios
      .get(`PublicDocMenuReport/GetReportR4/${docId}`)
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
      projectList, project1Label, project2Label,
      projectNumber, projectHeadName, facultyName,
      projectNameThai, projectNameEng, acceptTypeNameThai,
      conclusionDate, file1Name, permissionInsert,
    } = this.state;

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่บันทึก
                </span>
                <div className="form__form-group-field" style={{ backgroundColor: '#F2F4F7' }}>
                  <Field
                    name="dtDoc"
                    component={renderDatePickerDefauleValueField}
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
                    placeholder={projectNameThai}
                    options={projectList}
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
                <span className="form__form-group-label">{project1Label}</span>
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
                <span className="form__form-group-label">{project2Label}</span>
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
                <span className="form__form-group-label">ประเภทการรับรอง</span>
                <div className="form__form-group-field">
                  <Field
                    name="acceptTypeNameThai"
                    component="input"
                    type="text"
                    placeholder={acceptTypeNameThai}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่มีมตติรับรอง
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="conclusionDate"
                    component="input"
                    type="text"
                    placeholder={conclusionDate}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  แนบเอกสารรายงานความก้าวหน้าโครงการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    id="file1Name"
                    name="file1Name"
                    component={renderFileInputField}
                    value={file1Name}
                    onChange={this.handleChangeFile1}
                  />
                  <Button
                    size="sm"
                    color="primary"
                    outline
                    disabled={file1Name !== '' ? 0 : 1}
                    onClick={() => this.handleClickFileDownloadId(1)}
                  >ดาวน์โหลดไฟล์
                  </Button>
                </div>
              </div>
              <div className="form__form-group">
                <ButtonToolbar>
                  <Button color="success" type="submit" disabled={!permissionInsert}>บันทึก</Button>
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
  form: 'pages_a3_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
