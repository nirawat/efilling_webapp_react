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
    id: 'sectionName', disablePadding: true, label: 'หน่วยงาน',
  },
  {
    id: 'facultyName', disablePadding: false, label: 'คณะ',
  },
  {
    id: 'departmentName', disablePadding: false, label: 'ภาควิชา',
  },
  {
    id: 'group1genus', disablePadding: false, label: 'Genus',
  },
  {
    id: 'group1species', disablePadding: false, label: 'Species',
  },
  {
    id: 'group1riskHumanName', disablePadding: false, label: 'กลุ่มเสี่ยงต่อคน',
  },
  {
    id: 'group1riskAnimalName', disablePadding: false, label: 'เสี่ยงต่อสัตว์',
  },
  {
    id: 'group1pathogensName', disablePadding: false, label: 'โรค',
  },
  {
    id: 'group2genus', disablePadding: false, label: 'Genus',
  },
  {
    id: 'group2species', disablePadding: false, label: 'Species',
  },
  {
    id: 'group2riskHumanName', disablePadding: false, label: 'กลุ่มเสี่ยงต่อคน',
  },
  {
    id: 'group2riskAnimalName', disablePadding: false, label: 'เสี่ยงต่อสัตว์',
  },
  {
    id: 'group2pathogensName', disablePadding: false, label: 'โรค',
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
          <TableCell align="center" colSpan={3} style={{ backgroundColor: '#f9f9f9' }}>รายละเอียด</TableCell>
          <TableCell align="center" colSpan={5} style={{ backgroundColor: '#e6f7ff' }}>เชื้อโรคที่ครอบครอง</TableCell>
          <TableCell align="center" colSpan={5} style={{ backgroundColor: '#eafaea' }}>พิษจากสัตว์ที่ครอบครอง</TableCell>
        </TableRow>
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
