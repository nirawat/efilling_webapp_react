import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Row, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Config from 'react-global-configuration';
import { Link } from 'react-router-dom';
import nl2br from 'react-newline-to-break';
import Axios from 'axios';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import NotificationSystem from 'rc-notification';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import MatTableHead from './MatTableHead';
import ModalLink from './ModalLink';
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
      rowsPerPage: 4,
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

  handleClickResultNote = (projectNumber, value) => {
    if (value !== '' && value !== null) {
      this.setState({
        modalIsOpen: true,
        messageNotes: '',
      });
      Axios
        .get(`PublicDocMenuHome/GetResultNoteHome1/${projectNumber}`)
        .then((resp) => {
          this.setState({
            modalIsOpen: true,
            messageNotes: resp.data.resultNote,
          });
          return projectNumber;
        });
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
            projectHeadName: tbRows[i].project_head_name,
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
            requestEditMeetingDate: tbRows[i].request_edit_meeting_date,
            requestEditDate: tbRows[i].request_edit_date,
            reportStatusDate: tbRows[i].report_status_date,
            certificateExpireDate: tbRows[i].certificate_expire_date,
            requestRenewDate: tbRows[i].request_renew_date,
            closeProjectDate: tbRows[i].close_project_date,
            printCertificateDate: tbRows[i].print_certificate_date,
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
            projectHeadName: tbRows[i].project_head_name,
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
            requestEditMeetingDate: tbRows[i].request_edit_meeting_date,
            requestEditDate: tbRows[i].request_edit_date,
            reportStatusDate: tbRows[i].report_status_date,
            certificateExpireDate: tbRows[i].certificate_expire_date,
            requestRenewDate: tbRows[i].request_renew_date,
            closeProjectDate: tbRows[i].close_project_date,
            printCertificateDate: tbRows[i].print_certificate_date,
          });
        }
        this.setState({ data: rows });
      });
  }

  handleClickEditProjectRequest = (docId) => {
    window.open(`/forms/menuA/menuA1_Edit?docId=${docId}`, '_blank');
  }

  handleClickEditData = (type, projectNumber, value) => {
    if (value !== '' && value !== null) {
      switch (type) {
        case 'a3':
          window.open(`/forms/menuA/menuA3_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'a4':
          window.open(`/forms/menuA/menuA4_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'a5':
          window.open(`/forms/menuA/menuA5_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'a6':
          window.open(`/forms/menuA/menuA6_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'a7':
          window.open(`/forms/menuA/menuA7_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'b1':
          window.open(`/forms/menuB/menuB1_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'c1':
          window.open(`/forms/menuC/menuC1_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'c2':
          window.open(`/forms/menuC/menuC2_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'c3':
          window.open(`/forms/menuC/menuC3_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'c3_1':
          window.open(`/forms/menuC/menuC3_1_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'c3_2':
          window.open(`/forms/menuC/menuC3_2_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'c3_3':
          window.open(`/forms/menuC/menuC3_3_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'c3_4':
          window.open(`/forms/menuC/menuC3_4_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'c3_5':
          window.open(`/forms/menuC/menuC3_5_Edit?id=${projectNumber}`, '_blank');
          break;
        case 'd1':
          window.open(`/forms/menuD/menuD1_Edit?id=${projectNumber}`, '_blank');
          break;
        default:
          break;
      }
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
              <Row>
                <Col xs="6">
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
                </Col>
                <Col xs="6">
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
                </Col>
              </Row>
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
                          <TableCell className="material-table__cell material-table__cell-left">{d.projectHeadName}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditProjectRequest(d.projectRequestId, d.projectNumber)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.projectNameThai}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.projectNameEng}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.acronyms}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.risk_type}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.deliveryOnlineDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('b1', d.projectNumber, d.reviewRequestDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.reviewRequestDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.resultDocReview}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('c1', d.projectNumber, d.committeeAssignDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.committeeAssignDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickResultNote(d.projectNumber, d.committeeNameArray)}>
                            <ModalLink
                              isOpen={modalIsOpen}
                              header="success"
                              color="success"
                              title="ผลการพิจารณา"
                              btn={nl2br(d.committeeNameArray)}
                              message={messageNotes}
                            />
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('c2', d.projectNumber, d.committeeCommentDate)}>
                            <span style={{ color: '#34a8eb' }}>{nl2br(d.committeeCommentDate)}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">
                            <Dropdown>
                              <Dropdown.Toggle title={d.meetingDate} style={{ color: '#34a8eb', border: 0, backgroundColor: 'transparent' }} />
                              <Dropdown.MenuWrapper>
                                <Dropdown.Menu>
                                  <MenuItem
                                    eventKey={1}
                                    onSelect={() => { this.handleClickEditData('c3', d.projectNumber, d.meetingDate); }}
                                  >บันทึกการประชุม
                                  </MenuItem>
                                  <MenuItem divider />
                                  <MenuItem
                                    eventKey={2}
                                    onSelect={() => { this.handleClickEditData('c3_1', d.projectNumber, d.meetingDate); }}
                                  >ระเบียบวาระที่ 1
                                  </MenuItem>
                                  <MenuItem
                                    eventKey={3}
                                    onSelect={() => { this.handleClickEditData('c3_2', d.projectNumber, d.meetingDate); }}
                                  >ระเบียบวาระที่ 2
                                  </MenuItem>
                                  <MenuItem
                                    eventKey={4}
                                    onSelect={() => { this.handleClickEditData('c3_3', d.projectNumber, d.meetingDate); }}
                                  >ระเบียบวาระที่ 3
                                  </MenuItem>
                                  <MenuItem
                                    eventKey={5}
                                    onSelect={() => { this.handleClickEditData('c3_4', d.projectNumber, d.meetingDate); }}
                                  >ระเบียบวาระที่ 4
                                  </MenuItem>
                                  <MenuItem
                                    eventKey={6}
                                    onSelect={() => { this.handleClickEditData('c3_5', d.projectNumber, d.meetingDate); }}
                                  >ระเบียบวาระที่ 5
                                  </MenuItem>
                                </Dropdown.Menu>
                              </Dropdown.MenuWrapper>
                            </Dropdown>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.meetingApprovalDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.considerResult}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.alertDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('a4', d.projectNumber, d.requestEditMeetingDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.requestEditMeetingDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('a5', d.projectNumber, d.requestEditDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.requestEditDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('a3', d.projectNumber, d.reportStatusDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.reportStatusDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.certificateExpireDate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('a6', d.projectNumber, d.requestRenewDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.requestRenewDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('a7', d.projectNumber, d.closeProjectDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.closeProjectDate}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditData('d1', d.projectNumber, d.printCertificateDate)}>
                            <span className="form__form-group-label" style={{ color: '#34a8eb' }}>{d.printCertificateDate}</span>
                          </TableCell>
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
              rowsPerPageOptions={[4, 5, 10, 15]}
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
