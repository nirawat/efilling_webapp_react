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

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;

class PagesForm extends PureComponent {
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
      assignerSeq: '0',
      projectNumber: '',
      labTypeName: '',
      facultyName: '',
      safetyType: '',
      approvalType: '',
      commentConsider: '',
      acceptType: '2',
      permissionInsert: false,
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
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
      .get(`PublicDocMenuC/MenuC22InterfaceData/${eFillingSys.registerId}/${eFillingSys.fullName}`)
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
          assignerName: resp.data.default_assigner_name,
          assignerSeq: resp.data.default_assigner_seq,
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

  handleChangeAcceptType = (e) => {
    if (e.value === '1') {
      window.location = '/efilling/forms/menuC/menuC2';
    }
    this.setState({ acceptType: e.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicDocMenuC/AddDocMenuC22', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `
        ความเห็นของกรรมการผู้พิจารณาเสร็จสิ้น!`);
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
            this.show('danger', 'ข้อผิดผลาด!', 'กรุณาตรวจสอบข้อมูลของท่าน');
          } else {
            this.show('danger', 'Error', error.message);
          }
        } else {
          this.show('danger', 'Error', error.message);
        }
      });
  }

  handleChangeAssigner = (e) => {
    this.setState({
      assignerCode: e.value,
      assignerSeq: e.label.substring(0, 1),
      listProjectNumber: [],
      projectNumber: '',
      labTypeName: '',
      facultyName: '',
    });
    let initialProjectNumber = [];
    Axios
      .get(`PublicDocMenuC/GetRegisterUserDataC22/${e.value}`)
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
      .get(`PublicDocMenuC/GetProjectNumberWithDataC22/${e.value}`)
      .then((resp) => {
        this.setState({
          labTypeName: resp.data.labtypename,
          facultyName: resp.data.facultyname,
        });
        return '';
      })
      .catch(() => {
        this.setState({
          labTypeName: '',
          facultyName: '',
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
      projectNumber, labTypeName, facultyName,
      approvalType, commentConsider, acceptType,
      buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    const defaultAcceptType = 'คำขอประเมินห้องปฏิบัติการ';

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
                    { value: '2', label: 'คำขอประเมินห้องปฏิบัติการ' },
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
                  เลขสำคัญโครงการ (ห้องปฏิบัติการ)
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="projectNumber"
                    component={renderSelectField}
                    value={projectNumber}
                    placeholder={null}
                    onChange={this.handleChangeProjectNumber}
                    options={listProjectNumber}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ประเภทห้องปฏิบัติการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="labTypeName"
                    component="input"
                    type="text"
                    placeholder={labTypeName}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ห้องปฏิบัติการประจำคณะ
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
                <span className="form__form-group-label">ความเห็นการรับรอง</span>
                <div className="form__form-group-field">
                  <Field
                    name="approvalType"
                    component={renderSelectField}
                    onChange={this.handleChangeApprovalType}
                    value={approvalType}
                    options={[
                      { value: '1', label: 'รับรองห้องปฏิบัติการ' },
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
                  <Button color="success" type="submit" disabled={!buttonSaveEnable}>{buttonSaveStatus}</Button>
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
