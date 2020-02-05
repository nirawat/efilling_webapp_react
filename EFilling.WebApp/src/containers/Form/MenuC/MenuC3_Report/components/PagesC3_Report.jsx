import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Config from 'react-global-configuration';
import DownloadIcon from 'mdi-react/DownloadIcon';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import MatTableHead from './MatTableHead';
import ModalContent from './ModalContent';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderSelectField from '../../../../../shared/components/form/Select';

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
      listMeetingId: [],
      listMeetingType: [],
      meetingId: '',
      meetingTypeId: '',
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 10,
      modalIsOpen: true,
      permissionPrint: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.loadInterfaceData();
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
    this.setState({
      meetingId: '',
      meetingTypeId: '',
    });
    reset();
  }

  handleChangeMeeting = (e) => {
    this.setState({ meetingId: e.value });
  }

  handleChangeMeetingType = (e) => {
    this.setState({ meetingTypeId: e.value });
  }

  show = (color, title, message) => {
    notificationRU.notice({
      content: <BasicNotification
        color={color}
        title={title}
        message={message}
      />,
      duration: 20,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: 'right-up ltr-support',
    });
  };

  handleClickResultNote = (e) => {
    this.setState({
      modalIsOpen: true,
      messageNotes: e.value,
    });
  }

  loadInterfaceData = () => {
    this.setState({
      listMeetingId: [],
      listMeetingType: [],
      meetingId: '',
      meetingTypeId: '',
      data: [],
    });
    let initialMeetingId = [];
    let initialMeetingType = [];
    let tbRows = [];
    const rows = [];
    Axios
      .get(`PublicDocMenuR/MenuR1InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        initialMeetingId = resp.data.listMeetingId.map((e) => {
          initialMeetingId = [];
          return e;
        });
        initialMeetingType = resp.data.listMeetingType.map((e) => {
          initialMeetingType = [];
          return e;
        });
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
            docid: tbRows[i].docid,
            yearofmeeting: tbRows[i].yearofmeeting,
            meetinground: tbRows[i].meetinground,
            meetingdate: tbRows[i].meetingdate,
            meetingrecordname: tbRows[i].meetingrecordname,
            meetinglocation: tbRows[i].meetinglocation,
            isclosed: tbRows[i].isclosed,
            printAction: <DownloadIcon />,
          });
        }
        this.setState({
          listMeetingId: initialMeetingId,
          listMeetingType: initialMeetingType,
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
      .post('PublicDocMenuR/GetAllReportHistoryDataR1', this.state)
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
            docid: tbRows[i].docid,
            yearofmeeting: tbRows[i].yearofmeeting,
            meetinground: tbRows[i].meetinground,
            meetingdate: tbRows[i].meetingdate,
            meetingrecordname: tbRows[i].meetingrecordname,
            meetinglocation: tbRows[i].meetinglocation,
            isclosed: tbRows[i].isclosed,
            printAction: <DownloadIcon />,
          });
        }
        this.setState({
          data: rows,
        });
      });
  }

  render() {
    const {
      listMeetingId, meetingId,
      modalIsOpen,
    } = this.state;

    const {
      data, order, orderBy, rowsPerPage, page,
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

    const defaultMeetingType = 'เลือก...';

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form form--horizontal" onSubmit={this.searchReportData}>
              <div className="form__half">
                <div className="form__form-group">
                  <span className="form__form-group-label">วันที่ประชุม/ครั้งที่</span>
                  <div className="form__form-group-field">
                    <Field
                      name="meetingId"
                      component={renderSelectField}
                      onChange={this.handleChangeMeeting}
                      value={meetingId}
                      placeholder={defaultMeetingType}
                      options={listMeetingId}
                    />
                  </div>
                </div>
                <div className="form__form-group" style={{ paddingLeft: '140px' }}>
                  <ButtonToolbar>
                    <Button color="success" type="submit">ค้นหา</Button>
                    <Button onClick={this.handleReset}>ล้าง</Button>
                  </ButtonToolbar>
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
                            {d.docid}
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.yearofmeeting}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.meetinground}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.meetingdate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickResultNote(d.printAction)}>
                            <ModalContent
                              isOpen={modalIsOpen}
                              header="success"
                              color="success"
                              title="ดาวน์โหลดรายงาน"
                              docId={d.docid}
                              isClosed={d.isclosed}
                              meetingOfRound={d.meetinground}
                              meetingOfYear={d.yearofmeeting}
                              btn={d.printAction}
                            />
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
