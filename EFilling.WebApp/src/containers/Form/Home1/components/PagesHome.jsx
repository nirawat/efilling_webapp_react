import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Config from 'react-global-configuration';
import { Link } from 'react-router-dom';
import PaperclipIcon from 'mdi-react/DownloadIcon';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
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
      listYear: [],
      listAcceptType: [],
      rows: [],
      rowsToShow: '',
      pageOfItems: '',
      itemsToShow: '',
      defaultYear: 'all',
      defaultAcceptType: 'all',
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 5,
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
    this.setState({
      listYear: [],
      listAcceptType: [],
      rows: [],
    });
    reset();
  }

  handleChangeYear = (e) => {
    this.setState({ defaultYear: e.value });
  }

  handleChangeAcceptType = (e) => {
    this.setState({ defaultAcceptType: e.value });
  }

  handleClickDownloadFile = (e) => {
    Axios
      .get(`PublicDocMenuHome/DownloadFileHome2/${e}`)
      .then((resp) => {
        const url = resp.data.filebase64;
        const a = document.createElement('a');
        a.href = url;
        a.download = resp.data.filename;
        a.click();
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

  loadInterfaceData = () => {
    this.setState({
      listYear: [],
      listAcceptType: [],
      data: [],
      defaultYear: 'all',
      defaultAcceptType: 'all',
    });
    let initialYear = [];
    let initialAcceptType = [];
    let tbRows = [];
    const rows = [];
    Axios
      .get(`PublicDocMenuHome/MenuHome2InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        initialYear = resp.data.listYear.map((e) => {
          initialYear = [];
          return e;
        });
        initialAcceptType = resp.data.listAcceptType.map((e) => {
          initialAcceptType = [];
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
            col1: tbRows[i].col1,
            col2: tbRows[i].col2,
            col3: tbRows[i].col3,
            col4: tbRows[i].col4,
            col5: tbRows[i].col5,
            col6: tbRows[i].col6,
            col7: tbRows[i].col7,
            col8: tbRows[i].col8,
            col9: tbRows[i].col9,
            col10: tbRows[i].col10,
            col11: tbRows[i].col11,
            col12: tbRows[i].col12,
            col13: tbRows[i].col13,
            col14: tbRows[i].col14,
            col15: tbRows[i].col15,
            col16: <PaperclipIcon />,
          });
        }
        this.setState({
          listYear: initialYear,
          listAcceptType: initialAcceptType,
          defaultYear: 'all',
          defaultAcceptType: 'all',
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
      .post('PublicDocMenuHome/GetAllReportDataHome2/', this.state)
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
            col1: tbRows[i].col1,
            col2: tbRows[i].col2,
            col3: tbRows[i].col3,
            col4: tbRows[i].col4,
            col5: tbRows[i].col5,
            col6: tbRows[i].col6,
            col7: tbRows[i].col7,
            col8: tbRows[i].col8,
            col9: tbRows[i].col9,
            col10: tbRows[i].col10,
            col11: tbRows[i].col11,
            col12: tbRows[i].col12,
            col13: tbRows[i].col13,
            col14: tbRows[i].col14,
            col15: tbRows[i].col15,
            col16: <PaperclipIcon />,
          });
        }
        this.setState({
          data: rows,
        });
      });
  }

  render() {
    const {
      defaultYear, defaultAcceptType,
      listYear, listAcceptType,
    } = this.state;

    const {
      data, order, orderBy, rowsPerPage, page,
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

    const defaultYearAll = 'เลือก...';
    const defaultAcceptTypeAll = 'เลือก...';

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
                      name="defaultYear"
                      component={renderSelectField}
                      value={defaultYear}
                      onChange={this.handleChangeYear}
                      placeholder={defaultYearAll}
                      options={listYear}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ประเภทคำขอรับรอง</span>
                  <div className="form__form-group-field">
                    <Field
                      name="defaultAcceptType"
                      component={renderSelectField}
                      value={defaultAcceptType}
                      onChange={this.handleChangeAcceptType}
                      placeholder={defaultAcceptTypeAll}
                      options={listAcceptType}
                    />
                  </div>
                </div>
                <div className="form__form-group" style={{ paddingLeft: '140px' }}>
                  <ButtonToolbar>
                    <Button color="success" type="submit">ค้นหา</Button>
                    <Link className="btn btn-success" to="/forms/home">รายงานสถานะ</Link>
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
                            placeholder={xxx}
                          >
                            {d.col1}
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col2}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col3}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col4}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col5}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col6}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col7}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col8}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col9}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col10}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left"><Link to="/forms/home1">{d.col11}</Link></TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col12}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col13}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col14}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.col15}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickDownloadFile(d.col11)}>{d.col16}</TableCell>
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
