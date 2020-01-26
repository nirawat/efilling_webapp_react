import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Config from 'react-global-configuration';
import NoteMultipleIcon from 'mdi-react/NoteMultipleIcon';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import MatTableHead from './MatTableHead';
import { BasicNotification } from '../../../../../shared/components/Notification';

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
      searchKey: '',
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 10,
      modalIsOpen: true,
      permissionEdit: false,
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

  handleReset = (e) => {
    const { reset } = this.props;
    this.setState({
      searchKey: '',
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 10,
      modalIsOpen: true,
    });
    reset();
    this.searchReportData(e);
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

  handleClickEditMember = (e) => {
    const { permissionEdit } = this.state;
    if (!permissionEdit) {
      window.location = '/efilling/forms/errors/permission';
    }
    window.open(`/forms/menuF/menuF1_Edit?RegisterId=${e}`, '_blank');
  }

  loadInterfaceData = () => {
    this.setState({
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 10,
    });
    let tbRows = [];
    const rows = [];
    Axios
      .get(`PublicDocMenuF/MenuF1InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.listdata != null) {
          tbRows = resp.data.listdata.map((e) => {
            tbRows = [];
            return e;
          });
        }
        for (let i = 0; i < tbRows.length; i += 1) {
          counter += 1;
          rows.push({
            id: counter,
            registerid: tbRows[i].registerid,
            userid: tbRows[i].userid,
            fullname: tbRows[i].fullname,
            email: tbRows[i].email,
            workphone: tbRows[i].workphone,
            mobile: tbRows[i].mobile,
            fax: tbRows[i].fax,
            registerdate: tbRows[i].registerdate,
            educationname: tbRows[i].educationname,
            charactername: tbRows[i].charactername,
            positionname: tbRows[i].positionname,
            facultyname: tbRows[i].facultyname,
            isactive: tbRows[i].isactive,
            editAction: <NoteMultipleIcon />,
          });
        }
        this.setState({
          data: rows,
          permissionEdit: resp.data.userPermission.edit,
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
      .post('PublicDocMenuF/GetAllReportDataF1', this.state)
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
            registerid: tbRows[i].registerid,
            userid: tbRows[i].userid,
            fullname: tbRows[i].fullname,
            email: tbRows[i].email,
            workphone: tbRows[i].workphone,
            mobile: tbRows[i].mobile,
            fax: tbRows[i].fax,
            registerdate: tbRows[i].registerdate,
            educationname: tbRows[i].educationname,
            charactername: tbRows[i].charactername,
            positionname: tbRows[i].positionname,
            facultyname: tbRows[i].facultyname,
            isactive: tbRows[i].isactive,
            editAction: <NoteMultipleIcon />,
          });
        }
        this.setState({
          data: rows,
        });
      });
  }

  render() {
    const {
      searchKey,
    } = this.state;

    const {
      data, order, orderBy, rowsPerPage, page,
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form form--horizontal" onSubmit={this.searchReportData}>
              <div className="form__half">
                <div className="form__form-group">
                  <span className="form__form-group-label">ค้นหาสมาชิก:</span>
                  <div className="form__form-group-field">
                    <Field
                      name="searchKey"
                      component="input"
                      type="text"
                      value={searchKey}
                      onChange={this.handleChange}
                      placeholder="ค้นหาจาก รหัสสมาชิก, ชื่อ-สกุล, อีเมล์ เป็นต้น"
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
                            {d.registerid}
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.userid}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.fullname}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.email}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.educationname}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.charactername}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.positionname}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.facultyname}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.workphone}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.fax}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.registerdate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">
                            <span className="form__form-group-label" style={{ color: d.isactive ? '#00cc00' : '#ff3300' }}>{d.isactive}</span>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickEditMember(d.registerid)}>
                            <span className="form__form-group-label" style={{ color: '#66b3ff' }}>{d.editAction}</span>
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
  form: 'pagef1', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
