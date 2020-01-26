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

  constructor() {
    super();
    this.state = {
      listAssigner: [],
      listProjectNumber: [],
      listSafetyType: [],
      listApprovalType: [],
      assignerCode: eFillingSys.registerId,
      assignerName: eFillingSys.fullName,
      positionName: eFillingSys.positionName,
      docId: '',
      assignerSeq: '0',
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      safetyType: '',
      safetyTypeName: '',
      approvalType: '',
      approvalTypeName: '',
      commentConsider: '',
      acceptType: '1',
      permissionEdit: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeProjectNumber = this.handleChangeProjectNumber.bind(this);
    this.handleChangeAssigner = this.handleChangeAssigner.bind(this);
    this.handleChangeSafetyType = this.handleChangeSafetyType.bind(this);
    this.handleChangeApprovalType = this.handleChangeApprovalType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      listAssigner: [],
      listProjectNumber: [],
      listSafetyType: [],
      listApprovalType: [],
    });
    let initialAssigner = [];
    let initialProjectNumber = [];
    let initialSafetyType = [];
    let initialApprovalType = [];
    Axios
      .get(`PublicDocMenuC/MenuC2InterfaceDataEdit/${urlParams.get('id')}/${eFillingSys.registerId}/${eFillingSys.fullName}`)
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
        if (resp.data.listBoard != null) {
          initialSafetyType = resp.data.listSafetyType.map((e) => {
            initialSafetyType = [];
            return e;
          });
        }
        if (resp.data.listBoard != null) {
          initialApprovalType = resp.data.listApprovalType.map((e) => {
            initialApprovalType = [];
            return e;
          });
        }
        if (resp.data.listProjectNumber != null) {
          initialProjectNumber = resp.data.listProjectNumber.map((ee) => {
            initialProjectNumber = [];
            return ee;
          });
        }
        this.setState({
          listAssigner: initialAssigner,
          listProjectNumber: initialProjectNumber,
          listSafetyType: initialSafetyType,
          listApprovalType: initialApprovalType,
          docId: resp.data.editdata.docid,
          assignerName: resp.data.default_assigner_name,
          assignerSeq: resp.data.default_assigner_seq,
          projectNumber: resp.data.editdata.projectnumber,
          projectHeadName: resp.data.editdata.projectheadname,
          facultyName: resp.data.editdata.facultyname,
          projectNameThai: resp.data.editdata.projectnamethai,
          projectNameEng: resp.data.editdata.projectnameeng,
          safetyType: resp.data.editdata.safetytype,
          safetyTypeName: resp.data.editdata.safetytypename,
          approvalType: resp.data.editdata.approvaltype,
          approvalTypeName: resp.data.editdata.approvaltypename,
          commentConsider: resp.data.editdata.commentconsider,
          acceptType: resp.data.editdata.accepttype,
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

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicDocMenuC/UpdateDocMenuC2Edit', this.state)
      .then(() => {
        this.show('success', 'บันทึก', `
        ความเห็นของกรรมการผู้พิจารณาเสร็จสิ้น!`);
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
      positionSeq: '',
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
      safetyType: '',
      commentApproval: '',
      commentConsider: '',
      acceptType: '',
    });
    reset();
  }

  handleChangeAssigner = (e) => {
    this.setState({
      assignerCode: e.value,
      assignerSeq: e.label.substring(0, 1),
      listProjectNumber: [],
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      projectNameThai: '',
      projectNameEng: '',
    });
    let initialProjectNumber = [];
    Axios
      .get(`PublicDocMenuC/GetRegisterUserDataC2/${e.value}`)
      .then((resp) => {
        if (resp.data.listProjectNumber != null) {
          initialProjectNumber = resp.data.listProjectNumber.map((ee) => {
            initialProjectNumber = [];
            return ee;
          });
        }
        this.setState({
          positionName: resp.data.positionname,
          listProjectNumber: initialProjectNumber,
        });
        return '';
      });
  }

  handleChangeProjectNumber = (e) => {
    this.setState({ projectNumber: e.value });
    Axios
      .get(`PublicDocMenuC/GetProjectNumberWithDataC2/${e.value}`)
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

  handleChangeSafetyType = (e) => {
    this.setState({ safetyType: e.value });
  }

  handleChangeApprovalType = (e) => {
    this.setState({ approvalType: e.value });
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
      listAssigner, listProjectNumber,
      assignerCode, assignerName, positionName,
      projectNumber, projectHeadName, facultyName,
      projectNameThai, projectNameEng, safetyType, safetyTypeName,
      approvalType, approvalTypeName, commentConsider, acceptType,
      permissionEdit,
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
                  onChange={this.handleChangeAcceptType}
                  placeholder={defaultAcceptType}
                  options={[
                    { value: '1', label: 'คำขอรับรองโครงการ' },
                  ]}
                />
              </div>
            </div>
            <div className="card__title">
              <h5 className="bold-text">กรรมการ</h5>
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
                  เลขสำคัญโครงการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="projectNumber"
                    component={renderSelectField}
                    value={projectNumber}
                    placeholder={projectNameThai}
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
                <span className="form__form-group-label">ประเภทความปลอดภัย</span>
                <div className="form__form-group-field">
                  <Field
                    name="safetyType"
                    component={renderSelectField}
                    onChange={this.handleChangeSafetyType}
                    value={safetyType}
                    placeholder={safetyTypeName}
                    options={[
                      { value: '1', label: 'ประเภทที่ 1' },
                      { value: '2', label: 'ประเภทที่ 2' },
                      { value: '3', label: 'ประเภทที่ 3' },
                      { value: '4', label: 'ประเภทที่ 4' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ความเห็นการรับรอง</span>
                <div className="form__form-group-field">
                  <Field
                    name="approvalType"
                    component={renderSelectField}
                    onChange={this.handleChangeApprovalType}
                    value={approvalType}
                    placeholder={approvalTypeName}
                    options={[
                      { value: '1', label: 'รับรองงานวิจัย' },
                      { value: '2', label: 'รับรองงานวิจัย หลังจากปรับแก้ไข' },
                      { value: '3', label: 'รับรองงานวิจัย โดยให้ปรับแก้ไข (ตามมติคณะกรรมการ)' },
                      { value: '4', label: 'ยังไม่รับรอง' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ความเห็นประกอบการพิจารณา
                </span>
                <div className="form__form-group-field">
                  <textarea
                    name="commentConsider"
                    component="input"
                    type="text"
                    value={commentConsider}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <ButtonToolbar>
                  <Button color="success" type="submit" disabled={!permissionEdit}>บันทึก</Button>
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
  form: 'pages_c2_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
