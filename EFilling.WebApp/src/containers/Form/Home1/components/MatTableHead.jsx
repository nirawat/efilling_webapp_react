import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { RTLProps } from '../../../../shared/prop-types/ReducerProps';

const rows = [
  {
    id: 'col1', disablePadding: false, label: 'ลำดับ',
  },
  {
    id: 'col2', disablePadding: false, label: 'หมายเลขห้อง',
  },
  {
    id: 'col3', disablePadding: false, label: 'ประจำคณะ',
  },
  {
    id: 'col4', disablePadding: false, label: 'ภาควิชา/ส่วนงาน',
  },
  {
    id: 'col5', disablePadding: false, label: 'ที่อยู่ห้องปฏิบัติการ',
  },
  {
    id: 'col6', disablePadding: false, label: 'อาคาร',
  },
  {
    id: 'col7', disablePadding: false, label: 'ชั้นที่',
  },
  {
    id: 'col8', disablePadding: false, label: 'วันที่ยื่น',
  },
  {
    id: 'col9', disablePadding: false, label: 'วันที่ตรวจเอกสาร',
  },
  {
    id: 'col10', disablePadding: false, label: 'ผลการตรวจเอกสาร', width: 250,
  },
  {
    id: 'col11', disablePadding: false, label: 'เลขสำคัญการประเมิณ',
  },
  {
    id: 'col12', disablePadding: false, label: 'วันที่เข้าประชุม',
  },
  {
    id: 'col13', disablePadding: false, label: 'ผลการพิจารณา', width: 250,
  },
  {
    id: 'col14', disablePadding: false, label: 'วันมอบหมายกรรมการ',
  },
  {
    id: 'col15', disablePadding: false, label: 'วันกรรมการส่งความเห็น',
  },
  {
    id: 'col16', disablePadding: false, label: 'Download เอกสาร',
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
