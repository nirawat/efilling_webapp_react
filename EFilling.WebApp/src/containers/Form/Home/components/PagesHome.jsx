import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Config from 'react-global-configuration';
import { Link } from 'react-router-dom';
import DownloadIcon from 'mdi-react/DownloadIcon';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import ModalLink from './ModalLink';
import MatTableHead from './MatTableHead';
import { BasicNotification } from '../../../../shared/components/Notification';
import renderSelectField from '../../../../shared/components/form/Select';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;
let counter = 0;

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
      userId: eFillingSys.registerId,
      listYear: [],
      listProjectHead: [],
      listAcceptType: [],
      listFaculty: [],
      listAcronyms: [],
      listRisk: [],
      rows: [],
      rowsToShow: '',
      pageOfItems: '',
      itemsToShow: '',
      year: '',
      projectHead: '',
      acceptType: '',
      faculty: '',
      acronyms: '',
      risk: '',
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 5,
      modalIsOpen: true,
      messageNotes: '',
      permissionPrint: false,
    };
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.loadInterfaceData();
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    const { orderBy: stateOrderBy, order: stateOrder } = this.state;
    if (stateOrderBy === property && stateOrder === 'desc') { order = 'asc'; }
    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleReset = () => {
    const { reset } = this.props;
    reset();
    window.location = '/efilling/forms/home';
  }

  handleChangeYear = (e) => {
    this.setState({ year: e.value });
  }

  handleChangeProjectHead = (e) => {
    this.setState({ projectHead: e.value });
  }

  handleChangeAcceptType = (e) => {
    this.setState({ acceptType: e.value });
  }

  handleChangeFaculty = (e) => {
    this.setState({ faculty: e.value });
  }

  handleChangeAcronyms = (e) => {
    this.setState({ acronyms: e.value });
  }

  handleChangeRisk = (e) => {
    this.setState({ risk: e.value });
  }

  handleClickResultNote = (e) => {
    this.setState({
      modalIsOpen: true,
      messageNotes: '',
    });
    Axios
      .get(`PublicDocMenuHome/GetResultNoteHome1/${e}`)
      .then((resp) => {
        this.setState({
          modalIsOpen: true,
          messageNotes: resp.data.resultNote,
        });
        return e;
      });
  }

  handleClickDownloadFile = (e) => {
    const { permissionPrint } = this.state;
    if (permissionPrint) {
      Axios
        .get(`PublicDocMenuHome/DownloadFileHome1/${e}`)
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
    } else {
      this.show('success', 'แจ้งให้ทราบ', `สิทธิ์พิมพ์เอกสาร
      ถูกจำกัด!`);
    }
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

  loadInterfaceData = () => {
    this.setState({
      listYear: [],
      listProjectHead: [],
      listAcceptType: [],
      listFaculty: [],
      listAcronyms: [],
      listRisk: [],
      data: [],
      year: '',
      projectHead: '',
      acceptType: '',
      faculty: '',
      acronyms: '',
      risk: '',
    });
    let initialYear = [];
    let initialProjectHead = [];
    let initialAcceptType = [];
    let initialFaculty = [];
    let initialAcronyms = [];
    let initialRisk = [];
    let tbRows = [];
    const rows = [];
    Axios
      .get(`PublicDocMenuHome/MenuHome1InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.listYear != null) {
          initialYear = resp.data.listYear.map((e) => {
            initialYear = [];
            return e;
          });
        }
        if (resp.data.listProjectHead != null) {
          initialProjectHead = resp.data.listProjectHead.map((e) => {
            initialProjectHead = [];
            return e;
          });
        }
        if (resp.data.listAcceptType != null) {
          initialAcceptType = resp.data.listAcceptType.map((e) => {
            initialAcceptType = [];
            return e;
          });
        }
        if (resp.data.listFaculty != null) {
          initialFaculty = resp.data.listFaculty.map((e) => {
            initialFaculty = [];
            return e;
          });
        }
        if (resp.data.listAcronyms != null) {
          initialAcronyms = resp.data.listAcronyms.map((e) => {
            initialAcronyms = [];
            return e;
          });
        }
        if (resp.data.listRisk != null) {
          initialRisk = resp.data.listRisk.map((e) => {
            initialRisk = [];
            return e;
          });
        }
        if (resp.data.listReportData != null) {
          tbRows = resp.data.listReportData.map((e) => {
            tbRows = [];
            return e;
          });
        }
        for (let i = 0; i < tbRows.length; i += 1) {
          counter += 1;
          rows.push({
            id: counter,
            projectRequestId: tbRows[i].project_request_id,
            projectNameThai: tbRows[i].project_name_thai,
            projectNameEng: tbRows[i].project_name_eng,
            projectNumber: tbRows[i].project_number,
            acronyms: tbRows[i].acronyms,
            risk_type: tbRows[i].risk_type,
            deliveryOnlineDate: tbRows[i].delivery_online_date,
            reviewRequestDate: tbRows[i].review_request_date,
            resultDocReview: tbRows[i].result_doc_review,
            committeeAssignDate: tbRows[i].committee_assign_date,
            committeeNameArray: tbRows[i].committee_name_array,
            committeeCommentDate: tbRows[i].committee_comment_date,
            meetingDate: tbRows[i].meeting_date,
            meetingApprovalDate: tbRows[i].meeting_approval_date,
            considerResult: tbRows[i].consider_result,
            alertDate: tbRows[i].alert_date,
            requestEditDate: tbRows[i].request_edit_date,
            reportStatusDate: tbRows[i].report_status_date,
            certificateExpireDate: tbRows[i].certificate_expire_date,
            requestRenewDate: tbRows[i].request_renew_date,
            downloadFile: <DownloadIcon />,
          });
        }
        this.setState({
          listYear: initialYear,
          listProjectHead: initialProjectHead,
          listAcceptType: initialAcceptType,
          listFaculty: initialFaculty,
          listAcronyms: initialAcronyms,
          listRisk: initialRisk,
          year: 'all',
          projectHead: 'YWxs',
          acceptType: 'all',
          faculty: 'all',
          acronyms: 'all',
          risk: 'all',
          data: rows,
          permissionPrint: resp.data.userPermission.print,
        });
      });
  }

  searchReportData = (e) => {
    e.preventDefault();
    this.setState({
      data: [],
    });
    let tbRows = [];
    const rows = [];
    Axios
      .post('PublicDocMenuHome/GetAllReportDataHome1', this.state)
      .then((resp) => {
        if (resp.data != null) {
          tbRows = resp.data.map((ee) => {
            tbRows = [];
            return ee;
          });
        }
        for (let i = 0; i < tbRows.length; i += 1) {
          counter += 1;
          rows.push({
            id: counter,
            projectRequestId: tbRows[i].project_request_id,
            projectNameThai: tbRows[i].project_name_thai,
            projectNameEng: tbRows[i].project_name_eng,
            projectNumber: tbRows[i].project_number,
            acronyms: tbRows[i].acronyms,
            risk_type: tbRows[i].risk_type,
            deliveryOnlineDate: tbRows[i].delivery_online_date,
            reviewRequestDate: tbRows[i].review_request_date,
            resultDocReview: tbRows[i].result_doc_review,
            committeeAssignDate: tbRows[i].committee_assign_date,
            committeeNameArray: tbRows[i].committee_name_array,
            committeeCommentDate: tbRows[i].committee_comment_date,
            meetingDate: tbRows[i].meeting_date,
            meetingApprovalDate: tbRows[i].meeting_approval_date,
            considerResult: tbRows[i].consider_result,
            alertDate: tbRows[i].alert_date,
            requestEditDate: tbRows[i].request_edit_date,
            reportStatusDate: tbRows[i].report_status_date,
            certificateExpireDate: tbRows[i].certificate_expire_date,
            requestRenewDate: tbRows[i].request_renew_date,
            downloadFile: <DownloadIcon />,
          });
        }
        this.setState({ data: rows });
      });
  }

  handleClickEditCol2 = (e, projectNumber) => {
    if (projectNumber !== '') {
      this.show('danger', 'แจ้งให้ทราบ', 'ไม่สามารถแก้ไขโครงการได้!');
    } else {
      window.open(`/forms/menuA/menuA1_Edit?id=${e}`, '_blank');
    }
  }

  handleClickEditCol7 = (e, date) => {
    if (date !== '') {
      this.show('danger', 'แจ้งให้ทราบ', 'ไม่สามารถแก้ไขข้อมูลได้!');
    } else {
      window.open(`/forms/menuB/menuB1_Edit?id=${e}`, '_blank');
    }
  }

  handleClickEditCol17 = (e, date) => {
    if (date !== '') {
      this.show('danger', 'แจ้งให้ทราบ', 'ไม่สามารถแก้ไขข้อมูลได้!');
    } else {
      window.open(`/forms/menuC/menuC1_Edit?id=${e}`, '_blank');
    }
  }

  handleClickEditCol18 = (e, date) => {
    if (date !== '') {
      this.show('danger', 'แจ้งให้ทราบ', 'ไม่สามารถแก้ไขข้อมูลได้!');
    } else {
      window.open(`/forms/menuC/menuC2_Edit?id=${e}`, '_blank');
    }
  }

  handleClickEditCol19 = (e, date) => {
    if (date !== '') {
      this.show('danger', 'แจ้งให้ทราบ', 'ไม่สามารถแก้ไขข้อมูลได้!');
    } else {
      window.open(`/forms/menuC/menuC2_Edit?id=${e}`, '_blank');
    }
  }

  render() {
    const {
      year, projectHead, acceptType, faculty,
      acronyms, risk,
      listYear, listProjectHead, listAcceptType,
      listFaculty, listAcronyms, listRisk,
      modalIsOpen, messageNotes,
    } = this.state;

    const {
      data, order, orderBy, rowsPerPage, page,
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

    const defaultYear = 'เลือก...';
    const defaultProjectHead = 'เลือก...';
    const defaultAcceptType = 'เลือก...';
    const defaultFaculty = 'เลือก...';
    const defaultAcronyms = 'เลือก...';
    const defaultRisk = 'เลือก...';

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form form--horizontal" onSubmit={this.searchReportData}>
              <div className="form__half">
                <div className="form__form-group">
                  <span className="form__form-group-label">ปีงบประมาณ</span>
                  <div className="form__form-group-field">
                    <Field
                      name="year"
                      component={renderSelectField}
                      value={year}
                      onChange={this.handleChangeYear}
                      placeholder={defaultYear}
                      options={listYear}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">หัวหน้าโครงการ</span>
                  <div className="form__form-group-field">
                    <Field
                      name="projectHead"
                      component={renderSelectField}
                      value={projectHead}
                      onChange={this.handleChangeProjectHead}
                      placeholder={defaultProjectHead}
                      options={listProjectHead}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ประเภทคำขอรับรอง</span>
                  <div className="form__form-group-field">
                    <Field
                      name="acceptType"
                      component={renderSelectField}
                      value={acceptType}
                      onChange={this.handleChangeAcceptType}
                      placeholder={defaultAcceptType}
                      options={listAcceptType}
                    />
                  </div>
                </div>
                <div className="form__form-group" style={{ paddingLeft: '140px' }}>
                  <ButtonToolbar>
                    <Button color="success" type="submit">ค้นหา</Button>
                    <Link className="btn btn-success" to="/forms/home1">รายการประเมินห้องปฏิบัติการ</Link>
                    <Button onClick={this.handleReset}>ล้าง</Button>
                  </ButtonToolbar>
                </div>
              </div>
              <div className="form__half">
                <div className="form__form-group">
                  <span className="form__form-group-label">คณะ/หน่วยงาน</span>
                  <div className="form__form-group-field">
                    <Field
                      name="faculty"
                      component={renderSelectField}
                      value={faculty}
                      onChange={this.handleChangeFaculty}
                      placeholder={defaultFaculty}
                      options={listFaculty}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">คำย่อประเภท</span>
                  <div className="form__form-group-field">
                    <Field
                      name="acronyms"
                      component={renderSelectField}
                      value={acronyms}
                      onChange={this.handleChangeAcronyms}
                      placeholder={defaultAcronyms}
                      options={listAcronyms}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ประเภทความเสี่ยง</span>
                  <div className="form__form-group-field">
                    <Field
                      name="risk"
                      component={renderSelectField}
                      value={risk}
                      onChange={this.handleChangeRisk}
                      placeholder={defaultRisk}
                      options={listRisk}
                    />
                  </div>
                </div>
              </div>
            </form>
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
                            {d.id}
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.projectNumber}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditCol2(d.projectNameThai, d.projectNumber)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.projectNameThai}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.projectNameEng}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.acronyms}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.risk_type}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.deliveryOnlineDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditCol7(d.projectNumber, d.deliveryOnlineDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.reviewRequestDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickResultNote(d.projectNumber)}>
                            <ModalLink
                              isOpen={modalIsOpen}
                              header="success"
                              color="success"
                              title="ผลการตรวจเอกสาร"
                              btn={d.resultDocReview}
                              message={messageNotes}
                            />
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditCol17(d.projectNumber, d.committeeCommentDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.committeeAssignDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">
                            <textarea rows="5" cols="35" style={{ border: 'none', backgroundColor: 'transparent', whiteSpace: 'pre-wrap' }} placeholder={d.committeeNameArray} disabled />
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditCol18(d.projectNumber, d.meetingApprovalDate)}>
                            <textarea rows="5" cols="20" style={{ border: 'none', backgroundColor: 'transparent' }} placeholder={d.committeeCommentDate} disabled />
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.meetingDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditCol19(d.projectNumber, d.alertDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.meetingApprovalDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.considerResult}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.alertDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.requestEditDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.reportStatusDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.certificateExpireDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.requestRenewDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickDownloadFile(d.projectNumber)}>{d.downloadFile}</TableCell>
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
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'pages_home', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
