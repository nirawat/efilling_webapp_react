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
    id: 'col1', disablePadding: false, label: 'ลำดับ',
  },
  {
    id: 'col2', disablePadding: false, label: 'ชื่อกรรมการ',
  },
  {
    id: 'col3', disablePadding: false, label: 'ความเห็นประกอบการพิจารณา',
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
