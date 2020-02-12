import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Row, Button, ButtonToolbar, Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import DownloadIcon from 'mdi-react/DownloadIcon';
import classnames from 'classnames';
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

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
const urlParams = new URLSearchParams(window.location.search);
let notificationRU = null;

class PagesForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createBy: eFillingSys.registerId,
      activeTab: '1',
      projectCommittees: [],
      memberCommittees: [],
      docId: '',
      defaultUserName: '',
      projectType: '',
      projectTypeName: '',
      projectHead: '',
      projectHeadName: '',
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
      laboratoryUsedName: '',
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
      accordingTypeMethodName: '',
      projectOther: '',
      projectAccordingTypeMethod: '',
      projectAccordingTypeMethodName: '',
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
      member6ProjectHead: '',
      member6FacultyName: '',
      member6WorkPhone: '',
      member6Mobile: '',
      member6Fax: '',
      member6Email: '',
      member7ProjectHead: '',
      member7FacultyName: '',
      member7WorkPhone: '',
      member7Mobile: '',
      member7Fax: '',
      member7Email: '',
      member8ProjectHead: '',
      member8FacultyName: '',
      member8WorkPhone: '',
      member8Mobile: '',
      member8Fax: '',
      member8Email: '',
      member9ProjectHead: '',
      member9FacultyName: '',
      member9WorkPhone: '',
      member9Mobile: '',
      member9Fax: '',
      member9Email: '',
      member10ProjectHead: '',
      member10FacultyName: '',
      member10WorkPhone: '',
      member10Mobile: '',
      member10Fax: '',
      member10Email: '',
      labOtherName: '',
      labOtherNameDisable: true,
      permissionEdit: false,
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
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
      .get(`PublicDocMenuA/MenuA1InterfaceDataEdit/${urlParams.get('docId')}/${eFillingSys.registerId}/${eFillingSys.fullName}`)
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
          docId: urlParams.get('docId'),
          defaultUserName: resp.data.editdata.defaultusername,
          projectType: resp.data.editdata.projecttype,
          projectTypeName: resp.data.editdata.projecttypename,
          projectHead: resp.data.editdata.projecthead,
          projectHeadName: resp.data.editdata.projectheadname,
          facultyName: resp.data.editdata.facultyname,
          workPhone: resp.data.editdata.workphone,
          mobile: resp.data.editdata.mobile,
          fax: resp.data.editdata.fax,
          email: resp.data.editdata.email,
          projectNameThai: resp.data.editdata.projectnamethai,
          projectNameEng: resp.data.editdata.projectnameeng,
          budget: resp.data.editdata.budget,
          moneySupply: resp.data.editdata.moneysupply,
          laboratoryUsed: resp.data.editdata.laboratoryused,
          laboratoryUsedName: resp.data.editdata.laboratoryusedname,
          file1name: resp.data.editdata.file1name,
          file1base64: resp.data.editdata.file1base64,
          file2name: resp.data.editdata.file2name,
          file2base64: resp.data.editdata.file2base64,
          file3name: resp.data.editdata.file3name,
          file3base64: resp.data.editdata.file3base64,
          file4name: resp.data.editdata.file4name,
          file4base64: resp.data.editdata.file4base64,
          file5name: resp.data.editdata.file5name,
          file5base64: resp.data.editdata.file5base64,
          accordingTypeMethod: resp.data.editdata.accordingtypemethod,
          accordingTypeMethodName: resp.data.editdata.accordingtypemethodname,
          projectOther: resp.data.editdata.projectother,
          projectAccordingTypeMethod: resp.data.editdata.projectaccordingtypemethod,
          projectAccordingTypeMethodName: resp.data.editdata.projectaccordingtypemethodname,
          riskGroup1: resp.data.editdata.riskgroup1,
          riskGroup11: resp.data.editdata.riskgroup11,
          riskGroup12: resp.data.editdata.riskgroup12,
          riskGroup13: resp.data.editdata.riskgroup13,
          riskGroup14: resp.data.editdata.riskgroup14,
          riskGroup15: resp.data.editdata.riskgroup15,
          riskGroup15Other: resp.data.editdata.riskgroup15other,
          riskGroup2: resp.data.editdata.riskgroup2,
          riskGroup21: resp.data.editdata.riskgroup21,
          riskGroup22: resp.data.editdata.riskgroup22,
          riskGroup23: resp.data.editdata.riskgroup23,
          riskGroup24: resp.data.editdata.riskgroup24,
          riskGroup25: resp.data.editdata.riskgroup25,
          projectAccordingOther: resp.data.editdata.projectaccordingother,
          riskGroup3: resp.data.editdata.riskgroup3,
          riskGroup31: resp.data.editdata.riskgroup31,
          riskGroup32: resp.data.editdata.riskgroup32,
          riskGroup33: resp.data.editdata.riskgroup33,
          riskGroup34: resp.data.editdata.riskgroup34,
          riskGroup35: resp.data.editdata.riskgroup35,
          riskGroup4: resp.data.editdata.riskgroup4,
          riskGroup41: resp.data.editdata.riskgroup41,
          riskGroup42: resp.data.editdata.riskgroup42,
          riskGroup43: resp.data.editdata.riskgroup43,
          riskGroup44: resp.data.editdata.riskgroup44,
          riskGroup45: resp.data.editdata.riskgroup45,
          member1ProjectHead: resp.data.editdata.member1projecthead,
          member1ProjectHeadName: resp.data.editdata.member1projectheadname,
          member1FacultyName: resp.data.editdata.member1facultyname,
          member1WorkPhone: resp.data.editdata.member1workphone,
          member1Mobile: resp.data.editdata.member1mobile,
          member1Fax: resp.data.editdata.member1fax,
          member1Email: resp.data.editdata.member1email,
          member2ProjectHead: resp.data.editdata.member2projecthead,
          member2ProjectHeadName: resp.data.editdata.member2projectheadname,
          member2FacultyName: resp.data.editdata.member2facultyname,
          member2WorkPhone: resp.data.editdata.member2workphone,
          member2Mobile: resp.data.editdata.member2mobile,
          member2Fax: resp.data.editdata.member2fax,
          member2Email: resp.data.editdata.member2email,
          member3ProjectHead: resp.data.editdata.member3projecthead,
          member3ProjectHeadName: resp.data.editdata.member3projectheadname,
          member3FacultyName: resp.data.editdata.member3facultyname,
          member3WorkPhone: resp.data.editdata.member3workphone,
          member3Mobile: resp.data.editdata.member3mobile,
          member3Fax: resp.data.editdata.member3fax,
          member3Email: resp.data.editdata.member3email,
          member4ProjectHead: resp.data.editdata.member4projecthead,
          member4ProjectHeadName: resp.data.editdata.member4projectheadname,
          member4FacultyName: resp.data.editdata.member4facultyname,
          member4WorkPhone: resp.data.editdata.member4workphone,
          member4Mobile: resp.data.editdata.member4mobile,
          member4Fax: resp.data.editdata.member4fax,
          member4Email: resp.data.editdata.member4email,
          member5ProjectHead: resp.data.editdata.member5projecthead,
          member5ProjectHeadName: resp.data.editdata.member5projectheadname,
          member5FacultyName: resp.data.editdata.member5facultyname,
          member5WorkPhone: resp.data.editdata.member5workphone,
          member5Mobile: resp.data.editdata.member5mobile,
          member5Fax: resp.data.editdata.member5fax,
          member5Email: resp.data.editdata.member5email,
          member6ProjectHead: resp.data.editdata.member6projecthead,
          member6ProjectHeadName: resp.data.editdata.member6projectheadname,
          member6FacultyName: resp.data.editdata.member6facultyname,
          member6WorkPhone: resp.data.editdata.member6workphone,
          member6Mobile: resp.data.editdata.member6mobile,
          member6Fax: resp.data.editdata.member6fax,
          member6Email: resp.data.editdata.member6email,
          member7ProjectHead: resp.data.editdata.member7projecthead,
          member7ProjectHeadName: resp.data.editdata.member7projectheadname,
          member7FacultyName: resp.data.editdata.member7facultyname,
          member7WorkPhone: resp.data.editdata.member7workphone,
          member7Mobile: resp.data.editdata.member7mobile,
          member7Fax: resp.data.editdata.member7fax,
          member7Email: resp.data.editdata.member7email,
          member8ProjectHead: resp.data.editdata.member8projecthead,
          member8ProjectHeadName: resp.data.editdata.member8projectheadname,
          member8FacultyName: resp.data.editdata.member8facultyname,
          member8WorkPhone: resp.data.editdata.member8workphone,
          member8Mobile: resp.data.editdata.member8mobile,
          member8Fax: resp.data.editdata.member8fax,
          member8Email: resp.data.editdata.member8email,
          member9ProjectHead: resp.data.editdata.member9projecthead,
          member9ProjectHeadName: resp.data.editdata.member9projectheadname,
          member9FacultyName: resp.data.editdata.member9facultyname,
          member9WorkPhone: resp.data.editdata.member9workphone,
          member9Mobile: resp.data.editdata.member9mobile,
          member9Fax: resp.data.editdata.member9fax,
          member9Email: resp.data.editdata.member9email,
          member10ProjectHead: resp.data.editdata.member10projecthead,
          member10ProjectHeadName: resp.data.editdata.member10projectheadname,
          member10FacultyName: resp.data.editdata.member10facultyname,
          member10WorkPhone: resp.data.editdata.member10workphone,
          member10Mobile: resp.data.editdata.member10mobile,
          member10Fax: resp.data.editdata.member10fax,
          member10Email: resp.data.editdata.member10email,
          labOtherName: resp.data.editdata.labothername,
          permissionEdit: resp.data.userPermission.edit,
        });
        if (resp.data.editdata.laboratoryused === '99') {
          this.setState({ labOtherNameDisable: false });
        } else {
          this.setState({ labOtherNameDisable: true });
        }
        if (resp.data.editdata.projectnumber !== '') {
          this.setState({ buttonSaveEnable: false });
        } else if (resp.data.editdata.createby !== `${eFillingSys.registerId}`) {
          this.setState({ buttonSaveEnable: false });
        } else {
          this.setState({ buttonSaveEnable: true });
        }
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

  handleClickFileDownloadId = (e) => {
    const {
      file1base64, file2base64, file3base64, file4base64, file5base64,
      file1name, file2name, file3name, file4name, file5name,
    } = this.state;
    switch (e) {
      case 1:
        if (file1base64 !== null) {
          this.handleGetFileId(file1name, file1base64);
        } else this.handleFileDownloadId(e);
        break;
      case 2:
        if (file2base64 !== null) {
          this.handleGetFileId(file2name, file2base64);
        } else this.handleFileDownloadId(e);
        break;
      case 3:
        if (file3base64 !== null) {
          this.handleGetFileId(file3name, file3base64);
        } else this.handleFileDownloadId(e);
        break;
      case 4:
        if (file4base64 !== null) {
          this.handleGetFileId(file4name, file4base64);
        } else this.handleFileDownloadId(e);
        break;
      case 5:
        if (file5base64 !== null) {
          this.handleGetFileId(file5name, file5base64);
        } else this.handleFileDownloadId(e);
        break;
      default:
        break;
    }
  }

  handleGetFileId = (filename, filebase64) => {
    const url = window.atob(filebase64);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }

  handleFileDownloadId = (e) => {
    const { docId } = this.state;
    Axios
      .get(`PublicDocMenuA/GetA1DownloadFileById/${docId}/${e}`)
      .then((resp) => {
        const url = window.atob(resp.data.filebase64);
        const a = document.createElement('a');
        a.href = url;
        a.download = resp.data.filename;
        a.click();
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicDocMenuA/UpdateDocMenuA1Edit', this.state)
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
        const { permissionEdit } = this.state;
        this.setState({
          buttonSaveStatus: 'บันทึก',
          buttonSaveEnable: permissionEdit,
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

  handleChangeMemberProjectHeader = (index, e) => {
    Axios
      .get(`PublicRegister/GetFullRegisterUserById/${e.value}`)
      .then((resp) => {
        switch (index) {
          case 1:
            this.setState({
              member1ProjectHead: e.value,
              member1FacultyName: resp.data.facultyname,
              member1WorkPhone: resp.data.workphone,
              member1Mobile: resp.data.mobile,
              member1Fax: resp.data.fax,
              member1Email: resp.data.email,
            });
            break;
          case 2:
            this.setState({
              member2ProjectHead: e.value,
              member2FacultyName: resp.data.facultyname,
              member2WorkPhone: resp.data.workphone,
              member2Mobile: resp.data.mobile,
              member2Fax: resp.data.fax,
              member2Email: resp.data.email,
            });
            break;
          case 3:
            this.setState({
              member3ProjectHead: e.value,
              member3FacultyName: resp.data.facultyname,
              member3WorkPhone: resp.data.workphone,
              member3Mobile: resp.data.mobile,
              member3Fax: resp.data.fax,
              member3Email: resp.data.email,
            });
            break;
          case 4:
            this.setState({
              member4ProjectHead: e.value,
              member4FacultyName: resp.data.facultyname,
              member4WorkPhone: resp.data.workphone,
              member4Mobile: resp.data.mobile,
              member4Fax: resp.data.fax,
              member4Email: resp.data.email,
            });
            break;
          case 5:
            this.setState({
              member5ProjectHead: e.value,
              member5FacultyName: resp.data.facultyname,
              member5WorkPhone: resp.data.workphone,
              member5Mobile: resp.data.mobile,
              member5Fax: resp.data.fax,
              member5Email: resp.data.email,
            });
            break;
          case 6:
            this.setState({
              member6ProjectHead: e.value,
              member6FacultyName: resp.data.facultyname,
              member6WorkPhone: resp.data.workphone,
              member6Mobile: resp.data.mobile,
              member6Fax: resp.data.fax,
              member6Email: resp.data.email,
            });
            break;
          case 7:
            this.setState({
              member7ProjectHead: e.value,
              member7FacultyName: resp.data.facultyname,
              member7WorkPhone: resp.data.workphone,
              member7Mobile: resp.data.mobile,
              member7Fax: resp.data.fax,
              member7Email: resp.data.email,
            });
            break;
          case 8:
            this.setState({
              member8ProjectHead: e.value,
              member8FacultyName: resp.data.facultyname,
              member8WorkPhone: resp.data.workphone,
              member8Mobile: resp.data.mobile,
              member8Fax: resp.data.fax,
              member8Email: resp.data.email,
            });
            break;
          case 9:
            this.setState({
              member9ProjectHead: e.value,
              member9FacultyName: resp.data.facultyname,
              member9WorkPhone: resp.data.workphone,
              member9Mobile: resp.data.mobile,
              member9Fax: resp.data.fax,
              member9Email: resp.data.email,
            });
            break;
          case 10:
            this.setState({
              member10ProjectHead: e.value,
              member10FacultyName: resp.data.facultyname,
              member10WorkPhone: resp.data.workphone,
              member10Mobile: resp.data.mobile,
              member10Fax: resp.data.fax,
              member10Email: resp.data.email,
            });
            break;
          default:
            return null;
        }
        return '';
      });
  }

  handlePrintReport = () => {
    const { docId } = this.state;
    Axios
      .get(`PublicDocMenuReport/GetReportR1_2/${docId}`)
      .then((resp) => {
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
      });
  }

  render() {
    const {
      activeTab, projectCommittees, memberCommittees,
      projectType, projectTypeName, facultyName, workPhone,
      mobile, fax, email, projectNameThai, projectNameEng,
      budget, laboratoryUsed, laboratoryUsedName, projectHead, projectHeadName,
      file1name, file2name, file3name, file4name, file5name,
      accordingTypeMethod, accordingTypeMethodName, projectOther,
      projectAccordingTypeMethod, projectAccordingTypeMethodName,
      riskGroup15Other, projectAccordingOther, moneySupply,
      member1ProjectHeadName, member1FacultyName, member1WorkPhone, member1Mobile, member1Fax, member1Email,
      member2ProjectHeadName, member2FacultyName, member2WorkPhone, member2Mobile, member2Fax, member2Email,
      member3ProjectHeadName, member3FacultyName, member3WorkPhone, member3Mobile, member3Fax, member3Email,
      member4ProjectHeadName, member4FacultyName, member4WorkPhone, member4Mobile, member4Fax, member4Email,
      member5ProjectHeadName, member5FacultyName, member5WorkPhone, member5Mobile, member5Fax, member5Email,
      member6ProjectHeadName, member6FacultyName, member6WorkPhone, member6Mobile, member6Fax, member6Email,
      member7ProjectHeadName, member7FacultyName, member7WorkPhone, member7Mobile, member7Fax, member7Email,
      member8ProjectHeadName, member8FacultyName, member8WorkPhone, member8Mobile, member8Fax, member8Email,
      member9ProjectHeadName, member9FacultyName, member9WorkPhone, member9Mobile, member9Fax, member9Email,
      member10ProjectHeadName, member10FacultyName, member10WorkPhone, member10Mobile, member10Fax, member10Email,
      riskGroup1, riskGroup11, riskGroup12, riskGroup13, riskGroup14, riskGroup15,
      riskGroup2, riskGroup21, riskGroup22, riskGroup23, riskGroup24, riskGroup25,
      riskGroup3, riskGroup31, riskGroup32, riskGroup33, riskGroup34, riskGroup35,
      riskGroup4, riskGroup41, riskGroup42, riskGroup43, riskGroup44, riskGroup45,
      labOtherName, labOtherNameDisable,
      buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    return (
      <Col sm={12} md={12}>
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
                        ผู้ร่วมโครงการวิจัย
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
                      <Row>
                        <Col xs="6">
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
                            <span className="form__form-group-label">ประเภทโครงการ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="projectType"
                                component={renderSelectField}
                                value={projectType}
                                placeholder={projectTypeName}
                                onChange={this.handleChangeProjectType}
                                options={[
                                  { value: '1', label: 'ขอรับการพิจารณารับรองด้านความปลอดภัยทางชีวภาพระดับห้องปฏิบัติการ' },
                                  { value: '2', label: 'ขอรับการพิจารณารับรองด้านความปลอดภัยทางชีวภาพระดับภาคสนาม' },
                                ]}
                              />
                            </div>
                          </div>
                          <div className="form__form-group">
                            <span className="form__form-group-label">ชื่อโครงการวิจัยไทย</span>
                            <div className="form__form-group-field">
                              <input
                                name="projectNameThai"
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
                              <input
                                name="projectNameEng"
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
                              <input
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
                              <input
                                name="moneySupply"
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
                                placeholder={laboratoryUsedName}
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
                            <span className="form__form-group-label">ประเภทตามวิธีการ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="accordingTypeMethod"
                                component={renderSelectField}
                                value={accordingTypeMethod}
                                placeholder={accordingTypeMethodName}
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
                            <span className="form__form-group-label">ประเภทโครงการวิจัยตามวิธีการ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="projectAccordingTypeMethod"
                                component={renderSelectField}
                                value={projectAccordingTypeMethod}
                                placeholder={projectAccordingTypeMethodName}
                                onChange={this.handleChangeProjectAccordingTypeMethod}
                                options={[
                                  { value: '1', label: 'ด้านเกษตรและอาหาร' },
                                  { value: '2', label: 'ด้านทรัพยากรธรรมชาติและสิ่งแวดล้อม' },
                                  { value: '3', label: 'ด้านการแพทย์และสาธารณสุข' },
                                  { value: '4', label: 'ด้านการพัฒนาอุตสาหกรรม' },
                                  { value: '5', label: 'ด้านอื่นๆ (โปรดระบุ)' },
                                ]}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs="6">
                          <div className="form__form-group">
                            <span className="form__form-group-label">หัวหน้าโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="projectHead"
                                component={renderSelectField}
                                value={projectHead}
                                onChange={this.handleChangeProjectHeader}
                                placeholder={projectHeadName}
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
                            <span className="form__form-group-label">ห้องปฏิบัติการอื่นๆ</span>
                            <div className="form__form-group-field">
                              <input
                                name="labOtherName"
                                type="text"
                                value={labOtherName}
                                onChange={this.handleChange}
                                disabled={labOtherNameDisable}
                              />
                            </div>
                          </div>
                          <div className="form__form-group">
                            <span className="form__form-group-label">โครงการวิธีวิจัยอื่นๆ</span>
                            <div className="form__form-group-field">
                              <input
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
                        </Col>
                      </Row>
                      <div className="form__form-group">
                        <span className="form__form-group-label">ด้านอื่นๆ</span>
                        <div className="form__form-group-field">
                          <input
                            name="projectAccordingOther"
                            type="text"
                            maxLength={200}
                            value={projectAccordingOther}
                            onChange={this.handleChange}
                            disabled={projectAccordingTypeMethod !== '5'}
                          />
                        </div>
                      </div>
                      <Row>
                        <Col xs="12">
                          <div className="card__title">
                            <h5 className="bold-text">แนบคำขอ (NUIBC01) และเอกสารประกอบ</h5>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4">
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
                              <Button size="sm" className="icon" color="success" disabled={file1name !== '' ? !true : true} onClick={() => this.handleFileDownloadId(1)}><p><DownloadIcon /> ดาวน์โหลด</p></Button>
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
                              <Button size="sm" className="icon" color="success" disabled={file4name !== '' ? !true : true} onClick={() => this.handleFileDownloadId(4)}><p><DownloadIcon /> ดาวน์โหลด</p></Button>
                            </div>
                          </div>
                        </Col>
                        <Col xs="4">
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
                              <Button size="sm" className="icon" color="success" disabled={file2name !== '' ? !true : true} onClick={() => this.handleFileDownloadId(2)}><p><DownloadIcon /> ดาวน์โหลด</p></Button>
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
                              <Button size="sm" className="icon" color="success" disabled={file5name !== '' ? !true : true} onClick={() => this.handleFileDownloadId(5)}><p><DownloadIcon /> ดาวน์โหลด</p></Button>
                            </div>
                          </div>
                        </Col>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">
                              3.เอกสารชี้แจงรายละเอียดของเชื้อ/แบบฟอร์มข้อตกลงการใช้ตัวอย่างชีวภาพ
                            </span>
                            <div className="form__form-group-field">
                              <Field
                                name="file3name"
                                component={renderFileInputField}
                                value={file3name}
                                onChange={this.handleChangeFile3}
                              />
                              <Button size="sm" className="icon" color="success" disabled={file3name !== '' ? !true : true} onClick={() => this.handleFileDownloadId(3)}><p><DownloadIcon /> ดาวน์โหลด</p></Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12">
                          <div className="form__form-group">
                            <ButtonToolbar>
                              <Button color="success" type="submit" disabled={!buttonSaveEnable}>{buttonSaveStatus}</Button>
                              <Button color="success" onClick={this.handlePrintReport}>พิมพ์</Button>
                            </ButtonToolbar>
                          </div>
                          <div style={{ height: '30px' }}>.</div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 1 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member1ProjectHead"
                                placeholder={member1ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(1, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member1FacultyName"
                                component="input"
                                type="text"
                                placeholder={member1FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member1WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member1WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member1Mobile"
                                component="input"
                                type="text"
                                placeholder={member1Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member1Fax"
                                component="input"
                                type="text"
                                placeholder={member1Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member1Email"
                                component="input"
                                type="email"
                                placeholder={member1Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 2 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member2ProjectHead"
                                placeholder={member2ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(2, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member2FacultyName"
                                component="input"
                                type="text"
                                placeholder={member2FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member2WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member2WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member2Mobile"
                                component="input"
                                type="text"
                                placeholder={member2Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member2Fax"
                                component="input"
                                type="text"
                                placeholder={member2Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member2Email"
                                component="input"
                                type="email"
                                placeholder={member2Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 3 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member3ProjectHead"
                                placeholder={member3ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(3, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member3FacultyName"
                                component="input"
                                type="text"
                                placeholder={member3FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member3WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member3WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member3Mobile"
                                component="input"
                                type="text"
                                placeholder={member3Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member3Fax"
                                component="input"
                                type="text"
                                placeholder={member3Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member3Email"
                                component="input"
                                type="email"
                                placeholder={member3Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 4 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member4ProjectHead"
                                placeholder={member4ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(4, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member4FacultyName"
                                component="input"
                                type="text"
                                placeholder={member4FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member4WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member4WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member4Mobile"
                                component="input"
                                type="text"
                                placeholder={member4Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member4Fax"
                                component="input"
                                type="text"
                                placeholder={member4Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member4Email"
                                component="input"
                                type="email"
                                placeholder={member4Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 5 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member5ProjectHead"
                                placeholder={member5ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(5, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member5FacultyName"
                                component="input"
                                type="text"
                                placeholder={member5FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member5WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member5WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member5Mobile"
                                component="input"
                                type="text"
                                placeholder={member5Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member5Fax"
                                component="input"
                                type="text"
                                placeholder={member5Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member5Email"
                                component="input"
                                type="email"
                                placeholder={member5Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 6 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member6ProjectHead"
                                placeholder={member6ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(6, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member6FacultyName"
                                component="input"
                                type="text"
                                placeholder={member6FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member6WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member6WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member6Mobile"
                                component="input"
                                type="text"
                                placeholder={member6Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member6Fax"
                                component="input"
                                type="text"
                                placeholder={member6Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member6Email"
                                component="input"
                                type="email"
                                placeholder={member6Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 7 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member7ProjectHead"
                                placeholder={member7ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(7, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member7FacultyName"
                                component="input"
                                type="text"
                                placeholder={member7FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member7WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member7WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member7Mobile"
                                component="input"
                                type="text"
                                placeholder={member7Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member7Fax"
                                component="input"
                                type="text"
                                placeholder={member7Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member7Email"
                                component="input"
                                type="email"
                                placeholder={member7Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 8 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member8ProjectHead"
                                placeholder={member8ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(8, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member8FacultyName"
                                component="input"
                                type="text"
                                placeholder={member8FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member8WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member8WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member8Mobile"
                                component="input"
                                type="text"
                                placeholder={member8Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member8Fax"
                                component="input"
                                type="text"
                                placeholder={member8Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member8Email"
                                component="input"
                                type="email"
                                placeholder={member8Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 9 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member9ProjectHead"
                                placeholder={member9ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(9, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member9FacultyName"
                                component="input"
                                type="text"
                                placeholder={member9FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member9WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member9WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member9Mobile"
                                component="input"
                                type="text"
                                placeholder={member9Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member9Fax"
                                component="input"
                                type="text"
                                placeholder={member9Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member9Email"
                                component="input"
                                type="email"
                                placeholder={member9Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4">
                          <div className="form__form-group">
                            <span className="form__form-group-label">ลำดับที่ 10 ชื่อผู้ร่วมโครงการวิจัย</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member10ProjectHead"
                                placeholder={member10ProjectHeadName}
                                component={renderSelectField}
                                onChange={(event, value) => this.handleChangeMemberProjectHeader(10, value)}
                                options={memberCommittees}
                              />
                            </div>
                            <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member10FacultyName"
                                component="input"
                                type="text"
                                placeholder={member10FacultyName}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์ที่ทำงาน</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member10WorkPhone"
                                component="input"
                                type="text"
                                placeholder={member10WorkPhone}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรศัพท์มือถือ</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member10Mobile"
                                component="input"
                                type="text"
                                placeholder={member10Mobile}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">โทรสาร</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member10Fax"
                                component="input"
                                type="text"
                                placeholder={member10Fax}
                                disabled
                              />
                            </div>
                            <span className="form__form-group-label">อีเมล์</span>
                            <div className="form__form-group-field">
                              <Field
                                name="member10Email"
                                component="input"
                                type="email"
                                placeholder={member10Email}
                                disabled
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3">
                      <Row>
                        <Col xs="6">
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup1"
                                component="input"
                                type="checkbox"
                                checked={riskGroup1}
                                onChange={(event, value) => this.setState({ riskGroup1: value })}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label" style={{ color: '#009900' }}>
                                งานวิจัยประเภทที่ 1 (Risk Group 1)
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup11"
                                component="input"
                                type="checkbox"
                                checked={riskGroup11}
                                onChange={(event, value) => this.setState({ riskGroup11: value })}
                                disabled={!riskGroup1}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ไม่เป็นอัตราย ไม่ต้องขออนุญาตจากคณะกรรมการความปลอดภัยทางชีวภาพ แต่ต้องรายงานให้ทราบ
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup12"
                                component="input"
                                type="checkbox"
                                checked={riskGroup12}
                                onChange={(event, value) => this.setState({ riskGroup12: value })}
                                disabled={!riskGroup1}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองด้านพันธุวิศวกรรมที่ไม่เป็นอันตราย
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup13"
                                component="input"
                                type="checkbox"
                                checked={riskGroup13}
                                onChange={(event, value) => this.setState({ riskGroup13: value })}
                                disabled={!riskGroup1}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ใช้จุลินทรีย์ก่อโรคที่ไม่เป็นสาเหตุของโรคในคนหรือสัตว์
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup14"
                                component="input"
                                type="checkbox"
                                checked={riskGroup14}
                                onChange={(event, value) => this.setState({ riskGroup14: value })}
                                disabled={!riskGroup1}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ใช้แมลงและสัตว์ที่เป็นภาหะที่ไม่มีตัวก่อโรคจำเพาะ
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup15"
                                component="input"
                                type="checkbox"
                                checked={riskGroup15}
                                onChange={(event, value) => this.setState({ riskGroup15: value })}
                                disabled={!riskGroup1}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองประเภทอื่นๆ
                              </span>
                            </div>
                            <div className="form__form-group-field">
                              <Field
                                name="riskGroup15other"
                                component="input"
                                type="text"
                                maxLength={200}
                                value={riskGroup15Other}
                                onChange={this.handleChange}
                                placeholder="โปรดระบุ"
                                disabled={!riskGroup15}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs="6">
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup2"
                                component="input"
                                type="checkbox"
                                checked={riskGroup2}
                                onChange={(event, value) => this.setState({ riskGroup2: value })}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label" style={{ color: '#009900' }}>
                                งานวิจัยประเภทที่ 2 (Risk Group 2)
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup21"
                                component="input"
                                type="checkbox"
                                checked={riskGroup21}
                                onChange={(event, value) => this.setState({ riskGroup21: value })}
                                disabled={!riskGroup2}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่อาจเป็นอันตรายในระดับต่ำต่อผู้ปฏิบัติงานในห้องทดลอง ชุมชน และสิ่งแวดล้อม
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup22"
                                component="input"
                                type="checkbox"
                                checked={riskGroup22}
                                onChange={(event, value) => this.setState({ riskGroup22: value })}
                                disabled={!riskGroup2}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองด้านพันธุวิศวกรรมที่อาจเป็นอันตรายในระดับต่ำต่อผู้ปฏิบัติงานในห้องทดลอง ชุมชน และสิ่งแวดงล้อม
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup23"
                                component="input"
                                type="checkbox"
                                checked={riskGroup23}
                                onChange={(event, value) => this.setState({ riskGroup23: value })}
                                disabled={!riskGroup2}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ใช้ตัวโรค (pathogen) ที่มีศักยภาพเป็นสาเหตุของโรคในมนุษย์ในสภาพแวดล้อมทั่วไป
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup24"
                                component="input"
                                type="checkbox"
                                checked={riskGroup24}
                                onChange={(event, value) => this.setState({ riskGroup24: value })}
                                disabled={!riskGroup2}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ใช้แลงและสัตว์ที่เป็นภาหะที่มีตัวก่อโรคจำเพาะ
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup25"
                                component="input"
                                type="checkbox"
                                checked={riskGroup25}
                                onChange={(event, value) => this.setState({ riskGroup25: value })}
                                disabled={!riskGroup2}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                พิษจากสัตว์ กลุ่มที่ 1 ได้แก่ พิษจากสัตว์ที่ทำให้เกิดภาวะที่ร่างกายการทำงานได้ไม่เป็นปกติ ในระดับที่ไม่ร้ายแรงและมีวิธีรักษาที่ได้ผล
                              </span>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="6">
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup3"
                                component="input"
                                type="checkbox"
                                checked={riskGroup3}
                                onChange={(event, value) => this.setState({ riskGroup3: value })}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label" style={{ color: '#009900' }}>
                                งานวิจัยประเภทที่ 3 (Risk Group 3)
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup31"
                                component="input"
                                type="checkbox"
                                checked={riskGroup31}
                                onChange={(event, value) => this.setState({ riskGroup31: value })}
                                disabled={!riskGroup3}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่อาจเป็นอัตรายต่อผู้ปฏิบัติงานในห้องทดลอง ชุมชน และสิ่งแวดล้อม ในระดับที่ยังไม่เป็นที่ทราบแน่ชัด
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup32"
                                component="input"
                                type="checkbox"
                                checked={riskGroup32}
                                onChange={(event, value) => this.setState({ riskGroup32: value })}
                                disabled={!riskGroup3}
                                style={{ width: '35px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองด้านพันธุวิศวกรรมที่อาจเป็นตรายต่อผู้ปฏิบัติในห้องทดลอง ชุมชน และสิ่งแวดล้อม
                                หรือเกี่ยวกับการรักษาผู้ป่วยโดยการดัดแปลงพันธุกรรม หรืองานวิจัยที่อาจมีอันตรายในระดับที่ยังไม่เป็นที่ทราบแน่ชัด
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup33"
                                component="input"
                                type="checkbox"
                                checked={riskGroup33}
                                onChange={(event, value) => this.setState({ riskGroup33: value })}
                                disabled={!riskGroup3}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ใช้ตัว (pathogen) ที่เป็นสาเหตุของโรคที่รุนแรงในมนุษย์แค่ไม่แพร่เชื้อด้วยการสัมพัสโดยตรง
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup34"
                                component="input"
                                type="checkbox"
                                checked={riskGroup34}
                                onChange={(event, value) => this.setState({ riskGroup34: value })}
                                disabled={!riskGroup3}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ใช้แมลงและสัตว์ที่เป็นภาหะที่มีเชื้อไม่ทราบชนิตหรือมีสถานภาพไม่แน่นอน
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup35"
                                component="input"
                                type="checkbox"
                                checked={riskGroup35}
                                onChange={(event, value) => this.setState({ riskGroup35: value })}
                                disabled={!riskGroup3}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                พิษจากสัตว์ กลุ่มที่ 2 ได้แก่ พิษจากสัตว์ที่ทำให้เกิดภาวะที่ร่างกายการทำงานได้ไม่เป็นปกติ ในระดับที่ร้ายแรงและมีวิธีรักษาที่ได้ผล
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col xs="6">
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup4"
                                component="input"
                                type="checkbox"
                                checked={riskGroup4}
                                onChange={(event, value) => this.setState({ riskGroup4: value })}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label" style={{ color: '#009900' }}>
                                งานวิจัยประเภทที่ 4 (Risk Group 4)
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup41"
                                component="input"
                                type="checkbox"
                                checked={riskGroup41}
                                onChange={(event, value) => this.setState({ riskGroup41: value })}
                                disabled={!riskGroup4}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่มีอันตรายร้ายแรงต่อผู้ปฏิบัติงานในห้องทดลอง ชุมชน และสิ่งแวดล้อม และ/หรือชัดต่อศีลธรรม
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup42"
                                component="input"
                                type="checkbox"
                                checked={riskGroup42}
                                onChange={(event, value) => this.setState({ riskGroup42: value })}
                                disabled={!riskGroup4}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองด้านพันธุวิศวกรรมที่เป็นอันตรายร้ายแรงและ/หรือชัดต่อศีลธรรม
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup43"
                                component="input"
                                type="checkbox"
                                checked={riskGroup43}
                                onChange={(event, value) => this.setState({ riskGroup43: value })}
                                disabled={!riskGroup4}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ใช้เชื้อที่เป็นสาเหตุร้ายแรงในมนุษย์และยังรักษาไม่ได้
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup44"
                                component="input"
                                type="checkbox"
                                checked={riskGroup44}
                                onChange={(event, value) => this.setState({ riskGroup44: value })}
                                disabled={!riskGroup4}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                งานวิจัยและทดลองที่ใช้แมลงและสัตว์ที่เป็นภาหะที่ไม่โมเลกุลที่ถูกปรับเปลี่ยนพันธุกรรม
                              </span>
                            </div>
                          </div>
                          <div className="form__form-group">
                            <div className="form__form-group-field">
                              <Field
                                name="ckRiskGroup45"
                                component="input"
                                type="checkbox"
                                checked={riskGroup45}
                                onChange={(event, value) => this.setState({ riskGroup45: value })}
                                disabled={!riskGroup4}
                                style={{ width: '20px' }}
                              />
                              <span className="checkbox-btn__label">
                                พิษจากสัตว์ กลุ่มที่ 3 ได้แก่ พิษจากสัตว์ที่ทำให้เกิดภาวะที่ร่างกายการทำงานได้ไม่เป็นปกติ ในระดับที่ร้ายแรงและไม่มีวิธีรักษาที่ได้ผล
                              </span>
                            </div>
                          </div>
                        </Col>
                      </Row>
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
