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
import ModalPermission from './ModalPermission';
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
      userGroup: 'G001',
      defaultGroupName: 'นักวิจัย/นิสิต',
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 10,
      modalIsOpen: true,
      editPermission: false,
      pmview: false,
      pminsert: false,
      pmupdate: false,
      pmprint: false,
      pmalldata: false,
      permissionInsert: false,
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

  handleChangeUserGroup = (e) => {
    this.setState({ userGroup: e.value });
  };

  handleReset = (e) => {
    const { reset } = this.props;
    this.setState({
      userGroup: 'G001',
      defaultGroupName: 'นักวิจัย/นิสิต',
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 10,
      modalIsOpen: true,
      permissionInsert: false,
      permissionEdit: false,
    });
    reset();
    this.searchReportData(e);
  }

  handleClickPermission = () => {
    const { permissionEdit } = this.state;
    if (!permissionEdit) {
      window.location = '/efilling/forms/errors/permission';
    }
    this.setState({
      modalIsOpen: true,
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
      data: [],
    });
    const { userGroup } = this.state;
    let tbRows = [];
    const rows = [];
    Axios
      .get(`PublicDocMenuF/MenuF2InterfaceData/${eFillingSys.registerId}/${userGroup}`)
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
            usergroupname: tbRows[i].usergroupname,
            menupagecode: tbRows[i].menupagecode,
            menupagename: tbRows[i].menupagename,
            pmView: tbRows[i].pmview,
            pmInsert: tbRows[i].pminsert,
            pmUpdate: tbRows[i].pmupdate,
            pmPrint: tbRows[i].pmprint,
            pmAllData: tbRows[i].pmalldata,
            isactive: tbRows[i].isactive,
          });
        }
        this.setState({
          data: rows,
          permissionInsert: resp.data.userPermission.insert,
          permissionEdit: resp.data.userPermission.edit,
        });
      });
  }

  searchReportData = (e) => {
    e.preventDefault();
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
      .post('PublicDocMenuF/GetAllReportDataF2', this.state)
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
            usergroupname: tbRows[i].usergroupname,
            menupagecode: tbRows[i].menupagecode,
            menupagename: tbRows[i].menupagename,
            pmView: tbRows[i].pmview,
            pmInsert: tbRows[i].pminsert,
            pmUpdate: tbRows[i].pmupdate,
            pmPrint: tbRows[i].pmprint,
            pmAllData: tbRows[i].pmalldata,
            isactive: tbRows[i].isactive,
          });
        }
        this.setState({
          data: rows,
        });
      });
  }

  render() {
    const {
      userGroup, defaultGroupName, modalIsOpen,
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
                  <span className="form__form-group-label">กลุ่ม:</span>
                  <div className="form__form-group-field">
                    <Field
                      name="userGroup"
                      component={renderSelectField}
                      options={[
                        { value: 'G001', label: 'นักวิจัย/นิสิต' },
                        { value: 'G002', label: 'กรรมการ' },
                        { value: 'G003', label: 'กรรมการฝ่ายบริหาร/ประธาน/รองประธาน/เลขา/ผ.ช' },
                        { value: 'G004', label: 'เจ้าหน้าที่บริหาร' },
                        { value: 'G005', label: 'ที่ปรึกษา' },
                        { value: 'G007', label: 'ผู้ดูแลระบบ' },
                      ]}
                      value={userGroup}
                      placeholder={defaultGroupName}
                      onChange={this.handleChangeUserGroup}
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
                            {d.usergroupname}
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.menupagecode}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.menupagename}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.pmView}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.pmInsert}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.pmUpdate}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.pmPrint}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.pmAllData}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" onClick={() => this.handleClickPermission(d.menupagecode)}>
                            <ModalPermission
                              isOpen={modalIsOpen}
                              header="success"
                              color="success"
                              title="กำหนดสิทธิ์การใช้งาน"
                              btn="กำหนดสิทธิ์"
                              userGroupX={userGroup}
                              menuCodeX={d.menupagecode}
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
  form: 'pagef1', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
