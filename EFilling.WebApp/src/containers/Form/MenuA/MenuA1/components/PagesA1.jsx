import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar, Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderDatePickerDefauleValueField from '../../../../../shared/components/form/DatePickerDefaultValue';
import renderCheckBoxField from '../../../../../shared/components/form/CheckBox';
import renderSelectField from '../../../../../shared/components/form/Select';
import renderFileInputField from '../../../../../shared/components/form/FileInput';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createBy: eFillingSys.registerId,
      activeTab: '1',
      projectCommittees: [],
      memberCommittees: [],
      defaultUserName: '',
      docNumber: '',
      projectType: '',
      projectHead: '',
      facultyName: '',
      workPhone: '',
      mobile: '',
      fax: '',
      email: '',
      projectNameThai: '',
      projectNameEng: '',
      budget: '',
      moneySupply: '',
      laboratoryUsed: '',
      file1name: '',
      file1base64: '',
      file2name: '',
      file2base64: '',
      file3name: '',
      file3base64: '',
      file4name: '',
      file4base64: '',
      file5name: '',
      file5base64: '',
      accordingTypeMethod: '',
      projectOther: '',
      projectAccordingTypeMethod: '',
      reachOther: '',
      riskGroup1: false,
      riskGroup11: false,
      riskGroup12: false,
      riskGroup13: false,
      riskGroup14: false,
      riskGroup15: false,
      riskGroup15Other: '',
      riskGroup2: false,
      riskGroup21: false,
      riskGroup22: false,
      riskGroup23: false,
      riskGroup24: false,
      riskGroup25: false,
      projectAccordingOther: '',
      riskGroup3: false,
      riskGroup31: false,
      riskGroup32: false,
      riskGroup33: false,
      riskGroup34: false,
      riskGroup35: false,
      riskGroup4: false,
      riskGroup41: false,
      riskGroup42: false,
      riskGroup43: false,
      riskGroup44: false,
      riskGroup45: false,
      member1ProjectHead: '',
      member1FacultyName: '',
      member1WorkPhone: '',
      member1Mobile: '',
      member1Fax: '',
      member1Email: '',
      member2ProjectHead: '',
      member2FacultyName: '',
      member2WorkPhone: '',
      member2Mobile: '',
      member2Fax: '',
      member2Email: '',
      member3ProjectHead: '',
      member3FacultyName: '',
      member3WorkPhone: '',
      member3Mobile: '',
      member3Fax: '',
      member3Email: '',
      member4ProjectHead: '',
      member4FacultyName: '',
      member4WorkPhone: '',
      member4Mobile: '',
      member4Fax: '',
      member4Email: '',
      member5ProjectHead: '',
      member5FacultyName: '',
      member5WorkPhone: '',
      member5Mobile: '',
      member5Fax: '',
      member5Email: '',
      labOtherName: '',
      labOtherNameDisable: true,
      permissionInsert: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeProjectType = this.handleChangeProjectType.bind(this);
    this.handleChangeLaboratoryUsed = this.handleChangeLaboratoryUsed.bind(this);
    this.handleChangeAccordingTypeMethod = this.handleChangeAccordingTypeMethod.bind(this);
    this.handleChangeProjectAccordingTypeMethod = this.handleChangeProjectAccordingTypeMethod.bind(this);
    this.handleChangeProjectHeader = this.handleChangeProjectHeader.bind(this);
    this.handleChangeMemberProjectHeader = this.handleChangeMemberProjectHeader.bind(this);
    this.handleChangeFile1 = this.handleChangeFile1.bind(this);
    this.handleChangeFile2 = this.handleChangeFile2.bind(this);
    this.handleChangeFile3 = this.handleChangeFile3.bind(this);
    this.handleChangeFile4 = this.handleChangeFile4.bind(this);
    this.handleChangeFile5 = this.handleChangeFile5.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    let initialCommittees = [];
    let initialMembers = [];
    Axios
      .get(`PublicDocMenuA/MenuA1InterfaceData/${eFillingSys.registerId}/${eFillingSys.fullName}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        initialCommittees = resp.data.listCommittees.map((e) => {
          initialCommittees = [];
          return e;
        });
        initialMembers = resp.data.listMembers.map((e) => {
          initialMembers = [];
          return e;
        });
        this.setState({
          projectCommittees: initialCommittees,
          memberCommittees: initialMembers,
          defaultUserName: resp.data.defaultusername,
          projectHead: resp.data.defaultuserid,
          facultyName: resp.data.facultyname,
          workPhone: resp.data.workphone,
          mobile: resp.data.mobile,
          fax: resp.data.fax,
          email: resp.data.email,
          permissionInsert: resp.data.userPermission.insert,
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  toggle = (tab) => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeProjectType = (projectType) => {
    this.setState({ projectType: projectType.value });
  }

  handleChangeLaboratoryUsed = (laboratoryUsed) => {
    this.setState({ laboratoryUsed: laboratoryUsed.value });
    if (laboratoryUsed.value === '99') {
      this.setState({ labOtherNameDisable: false });
    } else {
      this.setState({ labOtherNameDisable: true });
    }
  }

  handleChangeAccordingTypeMethod = (accordingTypeMethod) => {
    this.setState({ accordingTypeMethod: accordingTypeMethod.value });
  }

  handleChangeProjectAccordingTypeMethod = (projectAccordingTypeMethod) => {
    this.setState({ projectAccordingTypeMethod: projectAccordingTypeMethod.value });
  }

  handleChangeProjectHeader = (projectHead) => {
    Axios
      .get(`PublicRegister/GetFullRegisterUserById/${projectHead.value}`)
      .then((resp) => {
        this.setState({ projectHead: projectHead.value });
        this.setState({
          facultyName: resp.data.facultyname,
          workPhone: resp.data.workphone,
          mobile: resp.data.mobile,
          fax: resp.data.fax,
          email: resp.data.email,
        });
        return '';
      })
      .catch(() => {
        this.setState({
          facultyName: '',
          workPhone: '',
          mobile: '',
          fax: '',
          email: '',
        });
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

  handleChangeFile2 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        file2name: e.name,
        file2base64: btoa(binaryString),
      });
    };
  }

  handleChangeFile3 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        file3name: e.name,
        file3base64: btoa(binaryString),
      });
    };
  }

  handleChangeFile4 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        file4name: e.name,
        file4base64: btoa(binaryString),
      });
    };
  }

  handleChangeFile5 = (e) => {
    const files = e.file;
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = (ee) => {
      const binaryString = ee.target.result;
      this.setState({
        file5name: e.name,
        file5base64: btoa(binaryString),
      });
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);
    Axios
      .post('/PublicDocMenuA/AddDocMenuA1', this.state)
      .then((resp) => {
        this.show('success', 'แจ้งให้ทราบ', `ยื่นเอกสาร
        ขอพิจารณาเพื่อการรับรองโครงการวิจัยใหม่เสร็จสิ้น!`);
        if (resp.data !== null) {
          const url1 = resp.data.filebase1and264;
          const a1 = document.createElement('a');
          a1.href = url1;
          a1.download = resp.data.filename1and2;
          a1.click();
          // eslint-disable-next-line
          const url2 = resp.data.filebase1664;
          const a2 = document.createElement('a');
          a2.href = url2;
          a2.download = resp.data.filename16;
          a2.click();
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
    reset();
    document.getElementById('file1name').value = null;
    document.getElementById('file2name').value = null;
    document.getElementById('file3name').value = null;
    document.getElementById('file4name').value = null;
    document.getElementById('file5name').value = null;
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

  handleChangeMemberProjectHeader = (index, memberProjectHeader) => {
    Axios
      .get(`PublicRegister/GetFullRegisterUserById/${memberProjectHeader.value}`)
      .then((resp) => {
        switch (index) {
          case 1:
            this.setState({
              member1ProjectHead: memberProjectHeader.value,
              member1FacultyName: resp.data.facultyname,
              member1WorkPhone: resp.data.workphone,
              member1Mobile: resp.data.mobile,
              member1Fax: resp.data.fax,
              member1Email: resp.data.email,
            });
            break;
          case 2:
            this.setState({
              member2ProjectHead: memberProjectHeader.value,
              member2FacultyName: resp.data.facultyname,
              member2WorkPhone: resp.data.workphone,
              member2Mobile: resp.data.mobile,
              member2Fax: resp.data.fax,
              member2Email: resp.data.email,
            });
            break;
          case 3:
            this.setState({
              member3ProjectHead: memberProjectHeader.value,
              member3FacultyName: resp.data.facultyname,
              member3WorkPhone: resp.data.workphone,
              member3Mobile: resp.data.mobile,
              member3Fax: resp.data.fax,
              member3Email: resp.data.email,
            });
            break;
          case 4:
            this.setState({
              member4ProjectHead: memberProjectHeader.value,
              member4FacultyName: resp.data.facultyname,
              member4WorkPhone: resp.data.workphone,
              member4Mobile: resp.data.mobile,
              member4Fax: resp.data.fax,
              member4Email: resp.data.email,
            });
            break;
          case 5:
            this.setState({
              member5ProjectHead: memberProjectHeader.value,
              member5FacultyName: resp.data.facultyname,
              member5WorkPhone: resp.data.workphone,
              member5Mobile: resp.data.mobile,
              member5Fax: resp.data.fax,
              member5Email: resp.data.email,
            });
            break;
          default:
            return null;
        }
        return '';
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });
  }

  getMemberFacultyName = (index) => {
    const {
      member1FacultyName, member2FacultyName, member3FacultyName,
      member4FacultyName, member5FacultyName,
    } = this.state;
    let resp = '';
    switch (index) {
      case 1:
        resp = member1FacultyName;
        break;
      case 2:
        resp = member2FacultyName;
        break;
      case 3:
        resp = member3FacultyName;
        break;
      case 4:
        resp = member4FacultyName;
        break;
      case 5:
        resp = member5FacultyName;
        break;
      default:
        return null;
    }
    return resp;
  }

  getMemberWorkPhone = (index) => {
    const {
      member1WorkPhone, member2WorkPhone, member3WorkPhone,
      member4WorkPhone, member5WorkPhone,
    } = this.state;
    let resp = '';
    switch (index) {
      case 1:
        resp = member1WorkPhone;
        break;
      case 2:
        resp = member2WorkPhone;
        break;
      case 3:
        resp = member3WorkPhone;
        break;
      case 4:
        resp = member4WorkPhone;
        break;
      case 5:
        resp = member5WorkPhone;
        break;
      default:
        return null;
    }
    return resp;
  }

  getMemberMobile = (index) => {
    const {
      member1Mobile, member2Mobile, member3Mobile,
      member4Mobile, member5Mobile,
    } = this.state;
    let resp = '';
    switch (index) {
      case 1:
        resp = member1Mobile;
        break;
      case 2:
        resp = member2Mobile;
        break;
      case 3:
        resp = member3Mobile;
        break;
      case 4:
        resp = member4Mobile;
        break;
      case 5:
        resp = member5Mobile;
        break;
      default:
        return null;
    }
    return resp;
  }

  getMemberFax = (index) => {
    const {
      member1Fax, member2Fax, member3Fax,
      member4Fax, member5Fax,
    } = this.state;
    let resp = '';
    switch (index) {
      case 1:
        resp = member1Fax;
        break;
      case 2:
        resp = member2Fax;
        break;
      case 3:
        resp = member3Fax;
        break;
      case 4:
        resp = member4Fax;
        break;
      case 5:
        resp = member5Fax;
        break;
      default:
        return null;
    }
    return resp;
  }

  getMemberEmail = (index) => {
    const {
      member1Email, member2Email, member3Email,
      member4Email, member5Email,
    } = this.state;
    let resp = '';
    switch (index) {
      case 1:
        resp = member1Email;
        break;
      case 2:
        resp = member2Email;
        break;
      case 3:
        resp = member3Email;
        break;
      case 4:
        resp = member4Email;
        break;
      case 5:
        resp = member5Email;
        break;
      default:
        return null;
    }
    return resp;
  }

  handleRemoveMember = (index) => {
    switch (index) {
      case 1:
        this.setState({
          member1ProjectHead: '',
          member1FacultyName: '',
          member1WorkPhone: '',
          member1Mobile: '',
          member1Fax: '',
          member1Email: '',
        });
        break;
      case 2:
        this.setState({
          member2ProjectHead: '',
          member2FacultyName: '',
          member2WorkPhone: '',
          member2Mobile: '',
          member2Fax: '',
          member2Email: '',
        });
        break;
      case 3:
        this.setState({
          member3ProjectHead: '',
          member3FacultyName: '',
          member3WorkPhone: '',
          member3Mobile: '',
          member3Fax: '',
          member3Email: '',
        });
        break;
      case 4:
        this.setState({
          member4ProjectHead: '',
          member4FacultyName: '',
          member4WorkPhone: '',
          member4Mobile: '',
          member4Fax: '',
          member4Email: '',
        });
        break;
      case 5:
        this.setState({
          member5ProjectHead: '',
          member5FacultyName: '',
          member5WorkPhone: '',
          member5Mobile: '',
          member5Fax: '',
          member5Email: '',
        });
        break;
      default:
        return null;
    }
    return '';
  }

  render() {
    const {
      docNumber,
      activeTab, projectCommittees, memberCommittees,
      projectType, projectHead, facultyName, workPhone,
      mobile, fax, email, projectNameThai, projectNameEng,
      budget, laboratoryUsed, defaultUserName,
      file1name, file2name, file3name, file4name, file5name,
      accordingTypeMethod, projectOther, projectAccordingTypeMethod,
      riskGroup15Other, projectAccordingOther, moneySupply,
      riskGroup1, riskGroup2, riskGroup3, riskGroup4,
      labOtherName, labOtherNameDisable, permissionInsert,
    } = this.state;

    const renderMembers = ({ fields }) => (
      <ul>
        <Button color="primary" size="sm" onClick={() => fields.push({})}>
          + เพิ่มผู้ร่วมโครงการวิจัย
        </Button>
        {fields.map((member, index) => (
          <li key={index.toString()} disabled>
            <div className="form__form-group">
              <span className="form__form-group-label">ชื่อผู้ร่วมโครงการวิจัย</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}.memberProjectHeader`}
                  component={renderSelectField}
                  onChange={(event, value) => this.handleChangeMemberProjectHeader(index + 1, value)}
                  options={memberCommittees}
                />
              </div>
              <span className="form__form-group-label">คณะ/หน่วยงาน</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}memberFacultyName`}
                  component="input"
                  type="text"
                  maxLength={100}
                  placeholder={this.getMemberFacultyName(index + 1)}
                  disabled
                />
              </div>
              <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}.memberWorkPhone`}
                  component="input"
                  type="text"
                  maxLength={20}
                  placeholder={this.getMemberWorkPhone(index + 1)}
                  disabled
                />
              </div>
              <span className="form__form-group-label">โทรศัพท์มือถือ</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}.memberMobile`}
                  component="input"
                  type="text"
                  maxLength={10}
                  placeholder={this.getMemberMobile(index + 1)}
                  disabled
                />
              </div>
              <span className="form__form-group-label">โทรสาร</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}.memberFax`}
                  component="input"
                  type="text"
                  maxLength={20}
                  placeholder={this.getMemberFax(index + 1)}
                  disabled
                />
              </div>
              <span className="form__form-group-label">อีเมล์</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}.memberEmail`}
                  component="input"
                  type="email"
                  maxLength={200}
                  placeholder={this.getMemberEmail(index + 1)}
                  disabled
                />
              </div>
            </div>
            <Button color="danger" size="sm" onClick={() => { fields.remove(index); this.handleRemoveMember(index + 1); }}>
              ลบ
            </Button>
          </li>
        ))}
      </ul>
    );

    return (
      <Col xs={12} md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <TabPane className="tabs tabs--bordered-bottom">
                <TabPane className="tabs__wrap">
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => {
                          this.toggle('1');
                        }}
                      >
                        ข้อมูลข้อเสนอโครงการ
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => {
                          this.toggle('2');
                        }}
                      >
                        ประเภทโครงการวิจัย
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '3' })}
                        onClick={() => {
                          this.toggle('3');
                        }}
                      >
                        ประเภทของงานวิจัย (Risk Group) แบ่งตามระดับความเสี่ยง
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <div className="form__form-group">
                        <span className="form__form-group-label">ประเภทโครงการ</span>
                        <div className="form__form-group-field">
                          <Field
                            name="projectType"
                            component={renderSelectField}
                            value={projectType}
                            onChange={this.handleChangeProjectType}
                            options={[
                              { value: '1', label: 'ขอรับการพิจารณารับรองด้านความปลอดภัยทางชีวภาพระดับห้องปฏิบัติการ' },
                              { value: '2', label: 'ขอรับการพิจารณารับรองด้านความปลอดภัยทางชีวภาพระดับภาคสนาม' },
                            ]}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">วันที่ยื่นข้อเสนอ</span>
                        <div className="form__form-group-field" style={{ backgroundColor: '#F2F4F7' }}>
                          <Field
                            name="dtDoc"
                            component={renderDatePickerDefauleValueField}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">ที่ ศธ.</span>
                        <div className="form__form-group-field">
                          <Field
                            name="docNumber"
                            component="input"
                            type="text"
                            maxLength={100}
                            value={docNumber}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">หัวหน้าโครงการวิจัย</span>
                        <div className="form__form-group-field">
                          <Field
                            name="projectHead"
                            component={renderSelectField}
                            value={projectHead}
                            onChange={this.handleChangeProjectHeader}
                            placeholder={defaultUserName}
                            options={projectCommittees}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                        <div className="form__form-group-field">
                          <Field
                            name="facultyName"
                            component="input"
                            type="text"
                            maxLength={100}
                            placeholder={facultyName}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                        <div className="form__form-group-field">
                          <Field
                            name="workPhone"
                            component="input"
                            type="text"
                            maxLength={20}
                            placeholder={workPhone}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                        <div className="form__form-group-field">
                          <Field
                            name="mobile"
                            component="input"
                            type="text"
                            maxLength={10}
                            placeholder={mobile}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">โทรสาร</span>
                        <div className="form__form-group-field">
                          <Field
                            name="fax"
                            component="input"
                            type="text"
                            maxLength={20}
                            placeholder={fax}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">อีเมล์</span>
                        <div className="form__form-group-field">
                          <Field
                            name="email"
                            component="input"
                            type="email"
                            maxLength={200}
                            placeholder={email}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">ชื่อโครงการวิจัยไทย</span>
                        <div className="form__form-group-field">
                          <Field
                            name="projectNameThai"
                            component="input"
                            type="text"
                            maxLength={200}
                            value={projectNameThai}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">ชื่อโครงการวิจัยอังกฤษ</span>
                        <div className="form__form-group-field">
                          <Field
                            name="projectNameEng"
                            component="input"
                            type="text"
                            maxLength={200}
                            value={projectNameEng}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">เงินงบประมาณ (ตัวเลข)</span>
                        <div className="form__form-group-field">
                          <Field
                            name="budget"
                            component="input"
                            type="number"
                            value={budget}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">แหล่งเงินทุน</span>
                        <div className="form__form-group-field">
                          <Field
                            name="moneySupply"
                            component="input"
                            type="text"
                            value={moneySupply}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">ห้องปฏิบัติการที่ใช้</span>
                        <div className="form__form-group-field">
                          <Field
                            name="laboratoryUsed"
                            component={renderSelectField}
                            value={laboratoryUsed}
                            onChange={this.handleChangeLaboratoryUsed}
                            options={[
                              { value: '1', label: 'AHS 3306 ภาควิชาเทคนิคการแพทย์ชั้น 6 คณะสหเวชศาสตร์' },
                              { value: '2', label: 'AHS 1616 อาคารบริหารคณะสหเวชศาสตร์' },
                              { value: '3', label: 'AHS 3304 ภาควิชาเทคนิคการแพทย์คณะสหเวชศาสตร์' },
                              { value: '4', label: 'MD 306 คณะวิทยาศาสตร์การแพทย์' },
                              { value: '5', label: 'MD 307 คณะวิทยาศาสตร์การแพทย์' },
                              { value: '6', label: 'MD 502-1 คณะวิทยาศาสตร์การแพทย์' },
                              { value: '7', label: 'ภ. 4303 อาคาร 4 ชั้น 3 คณะเภสัชศาสตร์' },
                              { value: '8', label: 'AG 2204 ภาควิชาวิทยาศาสตร์การเกษตรคณะศาสตร์' },
                              { value: '9', label: 'AG 5302 ชั้น 3 อาคารปฏิบัติการอตุสาหกรรมเกษตรคณะเกษตรศาสตร์' },
                              { value: '10', label: 'AG 2210/1 ภาควิชาวิทยาศาสตร์การเกษตรคณะเกษตรศาสตร์' },
                              { value: '11', label: 'DT 2314 คณะทันตแพทย์ศาสตร์' },
                              { value: '99', label: 'Other อื่นๆ' },
                            ]}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">ห้องปฏิบัติการอื่นๆ</span>
                        <div className="form__form-group-field">
                          <Field
                            name="labOtherName"
                            component="input"
                            type="text"
                            value={labOtherName}
                            onChange={this.handleChange}
                            disabled={labOtherNameDisable}
                          />
                        </div>
                      </div>
                      <div className="card__title">
                        <h5 className="bold-text">ข้อมูลผู้ร่วมโครงการวิจัย</h5>
                      </div>
                      <div className="form__form-group">
                        <FieldArray name="members" component={renderMembers} />
                      </div>
                      <div className="card__title">
                        <h5 className="bold-text">แนบคำขอ (NUIBC01) และเอกสารประกอบ</h5>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          1.แบบเสนอเพื่อขอรับการพิจารณารับรองด้านความปลอดภัย
                        </span>
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
                        <span className="form__form-group-label">
                          2.โครงการวิจัยฉบับสมบูรณ์
                        </span>
                        <div className="form__form-group-field">
                          <Field
                            name="file2name"
                            component={renderFileInputField}
                            value={file2name}
                            onChange={this.handleChangeFile2}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          3.เอกสารชี้แจงรายละเอียดของเชื้อที่ใช้/แบบฟอร์มข้อตกลงการใช้ตัวอย่างชีวภาพ
                        </span>
                        <div className="form__form-group-field">
                          <Field
                            name="file3name"
                            component={renderFileInputField}
                            value={file3name}
                            onChange={this.handleChangeFile3}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          4.หนังสือรับรองและอนุมัติให้ใช้สถานะที่
                        </span>
                        <div className="form__form-group-field">
                          <Field
                            name="file4name"
                            component={renderFileInputField}
                            value={file4name}
                            onChange={this.handleChangeFile4}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          5.อื่นๆ หากมี file มากกว่า 1 file โปรดรวมป็น zip file ให้เป็นเพียง 1 ไฟล์
                        </span>
                        <div className="form__form-group-field">
                          <Field
                            name="file5name"
                            component={renderFileInputField}
                            value={file5name}
                            onChange={this.handleChangeFile5}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <ButtonToolbar>
                          <Button color="success" type="submit" disabled={!permissionInsert}>บันทึก</Button>
                          <Button onClick={this.handleReset}>ล้าง</Button>
                        </ButtonToolbar>
                      </div>
                      <div>
                        <span className="form__form-group-label">.</span>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div className="form__form-group">
                        <span className="form__form-group-label">ประเภทตามวิธีการ</span>
                        <div className="form__form-group-field">
                          <Field
                            name="accordingTypeMethod"
                            component={renderSelectField}
                            value={accordingTypeMethod}
                            onChange={this.handleChangeAccordingTypeMethod}
                            options={[
                              { value: '1', label: 'โครงการวิจัยที่ใช้เทคโนโลยีชีวภาพสมัยใหม่หรือพันธวิศวกรรม (GMOs)' },
                              { value: '2', label: 'โครงการวิจัยที่ใช้จุลินทรีย์ก่อโรค (infactious agent)' },
                              { value: '3', label: 'โครงการวิจัยที่ใช้แมลงและสัตว์ที่เป็นพาหะ (arthropod vector)' },
                              { value: '4', label: 'โครงการวิจัยที่ใช้พิษจากสัตว์' },
                              { value: '5', label: 'โครงการวิจัยอื่นๆ' },
                            ]}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">โครงการวิธีวิจัยอื่นๆ</span>
                        <div className="form__form-group-field">
                          <Field
                            name="projectOther"
                            component="input"
                            type="text"
                            maxLength={200}
                            value={projectOther}
                            onChange={this.handleChange}
                            disabled={accordingTypeMethod !== '5'}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">ประเภทโครงการวิจัยตามวิธีการ</span>
                        <div className="form__form-group-field">
                          <Field
                            name="projectAccordingTypeMethod"
                            component={renderSelectField}
                            value={projectAccordingTypeMethod}
                            onChange={this.handleChangeProjectAccordingTypeMethod}
                            options={[
                              { value: '1', label: 'ด้านเกษตรและอาหาร' },
                              { value: '2', label: 'ด้านทรัพยากรธรรมชาติและสิ่งแวดล้อม' },
                              { value: '3', label: 'ด้านการแพทย์และสาธารณสุข' },
                              { value: '4', label: 'ด้านการพัฒนาอุตสาหกรรม' },
                              { value: '5', label: 'ด้านอื่นๆ' },
                            ]}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <span className="form__form-group-label">ด้านอื่นๆ</span>
                        <div className="form__form-group-field">
                          <Field
                            name="projectAccordingOther"
                            component="input"
                            type="text"
                            maxLength={200}
                            value={projectAccordingOther}
                            onChange={this.handleChange}
                            disabled={projectAccordingTypeMethod !== '5'}
                          />
                        </div>
                      </div>
                      <div style={{ height: '300px', color: '#fff' }}>.</div>
                    </TabPane>
                    <TabPane tabId="3">
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="riskGroup1"
                            component={renderCheckBoxField}
                            label="งานวิจัยประเภทที่ 1 (Risk Group 1)"
                            onChange={(event, value) => this.setState({ riskGroup1: value })}
                            className="colored"
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="riskGroup11"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ไม่เป็นอัตราย ไม่ต้องขออนุญาตจากคณะกรรมการความปลอดภัยทางชีวภาพ แต่ต้องรายงานให้ทราบ"
                            onChange={(event, value) => this.setState({ riskgroup11: value })}
                            className="click"
                            disabled={!riskGroup1}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="riskGroup12"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองด้านพันธุวิศวกรรมที่ไม่เป็นอันตราย"
                            onChange={(event, value) => this.setState({ riskgroup12: value })}
                            className="click"
                            disabled={!riskGroup1}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="riskGroup13"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ใช้จุลินทรีย์ก่อโรคที่ไม่เป็นสาเหตุของโรคในคนหรือสัตว์"
                            onChange={(event, value) => this.setState({ riskgroup13: value })}
                            className="click"
                            disabled={!riskGroup1}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="riskGroup14"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ใช้แมลงและสัตว์ที่เป็นภาหะที่ไม่มีตัวก่อโรคจำเพาะ"
                            onChange={(event, value) => this.setState({ riskgroup14: value })}
                            className="click"
                            disabled={!riskGroup1}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="riskGroup15"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองประเภทอื่นๆ"
                            onChange={(event, value) => this.setState({ riskgroup15: value })}
                            className="click"
                            disabled={!riskGroup1}
                          />
                        </div>
                        <div className="form__form-group-field">
                          <Field
                            name="riskgroup15other"
                            component="input"
                            type="text"
                            maxLength={200}
                            value={riskGroup15Other}
                            onChange={this.handleChange}
                            placeholder="โปรดระบุ"
                            disabled={!riskGroup1}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup2"
                            component={renderCheckBoxField}
                            label="งานวิจัยประเภทที่ 2 (Risk Group 2)"
                            onChange={(event, value) => this.setState({ riskGroup2: value })}
                            className="colored"
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup21"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่อาจเป็นอันตรายในระดับต่ำต่อผู้ปฏิบัติงานในห้องทดลอง ชุมชน และสิ่งแวดล้อม"
                            onChange={(event, value) => this.setState({ riskgroup21: value })}
                            className="click"
                            disabled={!riskGroup2}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup22"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองด้านพันธุวิศวกรรมที่อาจเป็นอันตรายในระดับต่ำต่อผู้ปฏิบัติงานในห้องทดลอง ชุมชน และสิ่งแวดงล้อม"
                            onChange={(event, value) => this.setState({ riskgroup22: value })}
                            className="click"
                            disabled={!riskGroup2}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup23"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ใช้ตัวโรค (pathogen) ที่มีศักยภาพเป็นสาเหตุของโรคในมนุษย์ในสภาพแวดล้อมทั่วไป"
                            onChange={(event, value) => this.setState({ riskgroup23: value })}
                            className="click"
                            disabled={!riskGroup2}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup24"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ใช้แลงและสัตว์ที่เป็นภาหะที่มีตัวก่อโรคจำเพาะ"
                            onChange={(event, value) => this.setState({ riskgroup24: value })}
                            className="click"
                            disabled={!riskGroup2}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup25"
                            component={renderCheckBoxField}
                            label="พิษจากสัตว์ กลุ่มที่ 1 ได้แก่ พิษจากสัตว์ที่ทำให้เกิดภาวะที่ร่างกายการทำงานได้ไม่เป็นปกติ ในระดับที่ไม่ร้ายแรงและมีวิธีรักษาที่ได้ผล"
                            onChange={(event, value) => this.setState({ riskgroup25: value })}
                            className="click"
                            disabled={!riskGroup2}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup3"
                            component={renderCheckBoxField}
                            label="งานวิจัยประเภทที่ 3 (Risk Group 3)"
                            onChange={(event, value) => this.setState({ riskGroup3: value })}
                            className="colored"
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup31"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่อาจเป็นอัตรายต่อผู้ปฏิบัติงานในห้องทดลอง ชุมชน และสิ่งแวดล้อม ในระดับที่ยังไม่เป็นที่ทราบแน่ชัด"
                            onChange={(event, value) => this.setState({ riskgroup31: value })}
                            className="click"
                            disabled={!riskGroup3}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup32"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองด้านพันธุวิศวกรรมที่อาจเป็นตรายต่อผู้ปฏิบัติในห้องทดลอง ชุมชน และสิ่งแวดล้อม หรือเกี่ยวกับการรักษาผู้ป่วยโดยการดัดแปลงพันธุกรรม หรืองานวิจัยที่อาจมีอันตรายในระดับที่ยังไม่เป็นที่ทราบแน่ชัด"
                            onChange={(event, value) => this.setState({ riskgroup32: value })}
                            className="click"
                            disabled={!riskGroup3}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup33"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ใช้ตัว (pathogen) ที่เป็นสาเหตุของโรคที่รุนแรงในมนุษย์แค่ไม่แพร่เชื้อด้วยการสัมพัสโดยตรง"
                            onChange={(event, value) => this.setState({ riskgroup33: value })}
                            className="click"
                            disabled={!riskGroup3}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup34"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ใช้แมลงและสัตว์ที่เป็นภาหะที่มีเชื้อไม่ทราบชนิตหรือมีสถานภาพไม่แน่นอน"
                            onChange={(event, value) => this.setState({ riskgroup34: value })}
                            className="click"
                            disabled={!riskGroup3}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup35"
                            component={renderCheckBoxField}
                            label="พิษจากสัตว์ กลุ่มที่ 2 ได้แก่ พิษจากสัตว์ที่ทำให้เกิดภาวะที่ร่างกายการทำงานได้ไม่เป็นปกติ ในระดับที่ร้ายแรงและมีวิธีรักษาที่ได้ผล"
                            onChange={(event, value) => this.setState({ riskgroup35: value })}
                            className="click"
                            disabled={!riskGroup3}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup4"
                            component={renderCheckBoxField}
                            label="งานวิจัยประเภทที่ 4 (Risk Group 4)"
                            onChange={(event, value) => this.setState({ riskGroup4: value })}
                            className="colored"
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup41"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่มีอันตรายร้ายแรงต่อผู้ปฏิบัติงานในห้องทดลอง ชุมชน และสิ่งแวดล้อม และ/หรือชัดต่อศีลธรรม"
                            onChange={(event, value) => this.setState({ riskgroup41: value })}
                            className="click"
                            disabled={!riskGroup4}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup42"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองด้านพันธุวิศวกรรมที่เป็นอันตรายร้ายแรงและ/หรือชัดต่อศีลธรรม"
                            onChange={(event, value) => this.setState({ riskgroup42: value })}
                            className="click"
                            disabled={!riskGroup4}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup43"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ใช้เชื้อที่เป็นสาเหตุร้ายแรงในมนุษย์และยังรักษาไม่ได้"
                            onChange={(event, value) => this.setState({ riskgroup43: value })}
                            className="click"
                            disabled={!riskGroup4}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup44"
                            component={renderCheckBoxField}
                            label="งานวิจัยและทดลองที่ใช้แมลงและสัตว์ที่เป็นภาหะที่ไม่โมเลกุลที่ถูกปรับเปลี่ยนพันธุกรรม"
                            onChange={(event, value) => this.setState({ riskgroup44: value })}
                            className="click"
                            disabled={!riskGroup4}
                          />
                        </div>
                      </div>
                      <div className="form__form-group">
                        <div className="form__form-group-field">
                          <Field
                            name="ckRiskGroup45"
                            component={renderCheckBoxField}
                            label="พิษจากสัตว์ กลุ่มที่ 3 ได้แก่ พิษจากสัตว์ที่ทำให้เกิดภาวะที่ร่างกายการทำงานได้ไม่เป็นปกติ ในระดับที่ร้ายแรงและไม่มีวิธีรักษาที่ได้ผล"
                            onChange={(event, value) => this.setState({ riskgroup45: value })}
                            className="click"
                            disabled={!riskGroup4}
                          />
                        </div>
                      </div>
                    </TabPane>
                  </TabContent>
                </TabPane>
              </TabPane>
            </form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'pages_a1_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
