import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { RTLProps } from '../../../../../shared/prop-types/ReducerProps';

const rows = [
  {
    id: 'registerid', disablePadding: false, label: 'รหัสสมาชิก',
  },
  {
    id: 'userid', disablePadding: false, label: 'รหัสผู้ใช้',
  },
  {
    id: 'fullname', disablePadding: false, label: 'ชื่อ-สกุล',
  },
  {
    id: 'email', disablePadding: false, label: 'อีเมล์',
  },
  {
    id: 'educationname', disablePadding: false, label: 'ระดับการศึกษา',
  },
  {
    id: 'charactername', disablePadding: false, label: 'ฐานและบทบาท',
  },
  {
    id: 'positionname', disablePadding: false, label: 'สถานะภาพ',
  },
  {
    id: 'facultyname', disablePadding: false, label: 'คณะ/หน่วยงาน',
  },
  {
    id: 'workphone', disablePadding: false, label: 'เบอร์โทรที่ทำงาน',
  },
  {
    id: 'fax', disablePadding: false, label: 'แฟกซ์',
  },
  {
    id: 'registerdate', disablePadding: false, label: 'วันที่ลงทะเบียน',
  },
  {
    id: 'isactive', disablePadding: false, label: 'สถานะ',
  },
  {
    id: 'editAction', disablePadding: false, label: 'แก้ไข',
  },
];

class MatTableHead extends PureComponent {
  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rtl: RTLProps.isRequired,
  };

  createSortHandler = property => (event) => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const {
      order, orderBy, rtl,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => (
            <TableCell
              className="material-table__cell material-table__cell--sort material-table__cell-right"
              key={row.id}
              align={rtl.direction === 'rtl' ? 'right' : 'left'}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
              style={{ backgroundColor: '#f9f9f9' }}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={this.createSortHandler(row.id)}
                className="material-table__sort-label"
                dir="ltr"
              >
                {row.label}
              </TableSortLabel>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}

export default connect(state => ({
  rtl: state.rtl,
}))(MatTableHead);
