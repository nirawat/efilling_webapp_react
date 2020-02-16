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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import MatTableHead from './MatTableHead';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderDatePickerDefauleValueField from '../../../../../shared/components/form/DatePickerDefaultValue';
import renderSelectField from '../../../../../shared/components/form/Select';
import renderDatePickerField from '../../../../../shared/components/form/DatePicker';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;

function getSorting(order, orderBy) {
  if (order === 'desc') {
    return (a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return -1;
      }
      if (a[orderBy] > b[orderBy]) {
        return 1;
      }
      return 0;
    };
  }
  return (a, b) => {
    if (a[orderBy] > b[orderBy]) {
      return -1;
    }
    if (a[orderBy] < b[orderBy]) {
      return 1;
    }
    return 0;
  };
}

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createBy: eFillingSys.registerId,
      projectList: [],
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      advisorsNameThai: '',
      acceptProjectNo: '',
      projectNameThai: '',
      projectNameEng: '',
      acceptTypeNameThai: '',
      acceptResult: '',
      acceptCondition: '',
      acceptDate: '',
      order: 'asc',
      orderBy: '',
      data: [],
      page: 0,
      rowsPerPage: 5,
      permissionInsert: false,
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeProjectNumber = this.handleChangeProjectNumber.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    let initialProjectNumber = [];
    Axios
      .get(`PublicDocMenuD/MenuD1InterfaceData/${eFillingSys.registerId}`)
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
          permissionInsert: resp.data.userPermission.insert,
          buttonSaveEnable: resp.data.userPermission.insert,
        });
      })
      .catch(() => {
        this.setState({
          projectList: [],
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeProjectNumber = (projectNumber) => {
    this.setState({
      data: [],
    });
    let tbRows = [];
    const rows = [];
    Axios
      .get(`PublicDocMenuD/GetProjectNumberWithDataD1/${projectNumber.value}`)
      .then((resp) => {
        if (resp.data.listRenewDate != null) {
          tbRows = resp.data.listRenewDate.map((e) => {
            tbRows = [];
            return e;
          });
        }
        for (let i = 0; i < tbRows.length; i += 1) {
          rows.push({
            renewRound: tbRows[i].renewround,
            acceptDate: tbRows[i].acceptdate,
            expireDate: tbRows[i].expiredate,
          });
        }
        this.setState({
          projectNumber: projectNumber.value,
          projectHeadName: resp.data.projectheadname,
          facultyName: resp.data.facultyname,
          advisorsNameThai: resp.data.advisorsnamethai,
          projectNameThai: resp.data.projectnamethai,
          projectNameEng: resp.data.projectnameeng,
          acceptTypeNameThai: resp.data.accepttypenamethai,
          data: rows,
        });
        return '';
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
      .post('/PublicDocMenuD/AddDocMenuD1', this.state)
      .then((resp) => {
        this.show('success', 'แจ้งให้ทราบ', `บันทึกเอกสาร
        ออกใบรับรองโครงการผ่านการประเมิณเสร็จสิ้น!`);
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
            this.show('danger', 'ข้อผิดผลาด!', 'กรุณาตรวจสอบข้อมูลของท่าน');
          } else {
            this.show('danger', 'Error', error.message);
          }
        } else {
          this.show('danger', 'Error', error.message);
        }
      });
  }

  handleChangeAcceptDate = (e) => {
    this.setState({ acceptDate: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleReset = () => {
    const { reset } = this.props;
    this.setState({
      projectNumber: '',
      projectHeadName: '',
      facultyName: '',
      advisorsNameThai: '',
      acceptProjectNo: '',
      projectNameThai: '',
      projectNameEng: '',
      acceptTypeNameThai: '',
      acceptResult: '',
      acceptCondition: '',
      acceptDate: '',
      renewTable: [],
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
      duration: 15,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  handleChangeAcceptResult = (e) => {
    this.setState({ acceptResult: e.value });
  }

  handleChangeAcceptCondition = (e) => {
    this.setState({ acceptCondition: e.value });
  }

  handleChangeTableAcceptDate1 = (e) => {
    this.setState({ tableAcceptDate1: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleChangeTableAcceptDate2 = (e) => {
    this.setState({ tableAcceptDate2: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleChangeTableAcceptDate3 = (e) => {
    this.setState({ tableAcceptDate3: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleChangeTableAcceptDate4 = (e) => {
    this.setState({ tableAcceptDate4: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  handleChangeTableAcceptDate5 = (e) => {
    this.setState({ tableAcceptDate5: e.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) });
  }

  render() {
    const {
      projectList,
      projectNumber, projectHeadName, facultyName, acceptProjectNo,
      projectNameThai, projectNameEng, acceptTypeNameThai,
      acceptResult, acceptCondition, acceptDate,
      buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    const {
      data, order, orderBy, rowsPerPage, page,
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

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
                    onChange={this.handleChangeProjectNumber}
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
                <span className="form__form-group-label">
                  เลขที่รับรองโครงการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="acceptProjectNo"
                    component="input"
                    type="text"
                    value={acceptProjectNo}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ชื่อโครงการภาษาไทย
                </span>
                <div className="form__form-group-field">
                  <input
                    name="projectNameThai"
                    component="input"
                    type="text"
                    value={projectNameThai}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ชื่อโครงการภาษาอังกฤษ
                </span>
                <div className="form__form-group-field">
                  <input
                    name="projectNameEng"
                    component="input"
                    type="text"
                    value={projectNameEng}
                    onChange={this.handleChange}
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
                <span className="form__form-group-label">ผลการพิจารณา</span>
                <div className="form__form-group-field">
                  <Field
                    name="acceptResult"
                    component={renderSelectField}
                    value={acceptResult}
                    onChange={this.handleChangeAcceptResult}
                    options={[
                      { value: '1', label: 'รับรอง' },
                      { value: '2', label: 'ไม่รับรอง' },
                      { value: '3', label: 'เข้าข่ายการรับรอง' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">เงื่อนไขการรับรอง</span>
                <div className="form__form-group-field">
                  <Field
                    name="acceptCondition"
                    component={renderSelectField}
                    value={acceptCondition}
                    onChange={this.handleChangeAcceptCondition}
                    options={[
                      { value: '1', label: 'แบบปีต่อปี' },
                      { value: '2', label: 'ไม่มีวันหมอายุ' },
                    ]}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่ต่ออายุ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="acceptDate"
                    placeholder={acceptDate}
                    component={renderDatePickerField}
                    onChange={this.handleChangeAcceptDate}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <h4 className="form__form-group-label">
                  ประวัติการรับรองและการต่ออายุ
                </h4>
                <div className="material-table__wrap">
                  <Table className="material-table">
                    <MatTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={this.handleRequestSort}
                      rowCount={data.length}
                    />
                    <TableBody>
                      {data
                        .sort(getSorting(order, orderBy))
                        .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                        .map((d) => {
                          const xxx = '';
                          return (
                            <TableRow
                              className="material-table__row"
                              tabIndex={-1}
                              key={d.id}
                            >
                              <TableCell
                                className="material-table__cell material-table__cell-left"
                                component="th"
                                scope="row"
                                placeholder={xxx}
                              >
                                {d.renewRound}
                              </TableCell>
                              <TableCell className="material-table__cell material-table__cell-left">{d.acceptDate}</TableCell>
                              <TableCell className="material-table__cell material-table__cell-left">{d.expireDate}</TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 49 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination
                  component="div"
                  className="material-table__pagination"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                  nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 15]}
                  dir="ltr"
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                />
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
  form: 'pages_d1_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
