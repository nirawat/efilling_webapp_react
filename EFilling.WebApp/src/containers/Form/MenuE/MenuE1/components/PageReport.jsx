import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import { reduxForm } from 'redux-form';
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

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

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
      order: 'asc',
      orderBy: 'calories',
      data: [],
      page: 0,
      rowsPerPage: 5,
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
      data: [],
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
    let tbRows = [];
    const rows = [];
    Axios
      .get('PublicDocMenuE/GetAllReportDataE1')
      .then((resp) => {
        if (resp.data != null) {
          tbRows = resp.data.map((e) => {
            tbRows = [];
            return e;
          });
        }
        for (let i = 0; i < tbRows.length; i += 1) {
          counter += 1;
          rows.push({
            id: counter,
            sectionName: tbRows[i].sectionName,
            facultyName: tbRows[i].facultyName,
            departmentName: tbRows[i].departmentName,
            group1genus: tbRows[i].group1genus,
            group1species: tbRows[i].group1species,
            group1riskHumanName: tbRows[i].group1riskHumanName,
            group1riskAnimalName: tbRows[i].group1riskAnimalName,
            group1pathogensName: tbRows[i].group1pathogensName,
            group2genus: tbRows[i].group2genus,
            group2species: tbRows[i].group2species,
            group2riskHumanName: tbRows[i].group2riskHumanName,
            group2riskAnimalName: tbRows[i].group2riskAnimalName,
            group2pathogensName: tbRows[i].group2pathogensName,
          });
        }
        this.setState({
          data: rows,
        });
      });
  }

  render() {
    const {
      data, order, orderBy, rowsPerPage, page,
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
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
                            {d.sectionName}
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.facultyName}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.departmentName}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group1genus}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group1species}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group1riskHumanName}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group1riskAnimalName}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group1pathogensName}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group2genus}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group2species}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group2riskHumanName}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group2riskAnimalName}</TableCell>
                          <TableCell className="material-table__cell material-table__cell-left">{d.group2pathogensName}</TableCell>
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
  form: 'pages_e1_report', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
