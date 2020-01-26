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
    id: 'usergroupname', disablePadding: false, label: 'กลุ่ม',
  },
  {
    id: 'menupagecode', disablePadding: false, label: 'รหัสเมนูเพจ',
  },
  {
    id: 'menupagename', disablePadding: false, label: 'ชื่อเมนูเพจ',
  },
  {
    id: 'pmView', disablePadding: false, label: 'สิทธิ์การเข้าถึง',
  },
  {
    id: 'pmInsert', disablePadding: false, label: 'สิทธิ์เพิ่ม',
  },
  {
    id: 'pmUpdate', disablePadding: false, label: 'สิทธิ์แก้ไข',
  },
  {
    id: 'pmPrint', disablePadding: false, label: 'สิทธิ์พิมพ์/ดาวน์โหลด',
  },
  {
    id: 'pmAllData', disablePadding: false, label: 'สิทธิ์ดูข้อมูลทั้งหมด',
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
