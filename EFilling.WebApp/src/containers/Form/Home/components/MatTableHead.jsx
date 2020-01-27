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
    id: 'id', disablePadding: false, label: 'ลำดับที่',
  },
  {
    id: 'projectNumber', disablePadding: false, label: 'เลขสำคัญโครงการ',
  },
  {
    id: 'projectNumber', disablePadding: false, label: 'หัวหน้าโครงการ',
  },
  {
    id: 'projectNameThai', disablePadding: false, label: 'ชื่อโครงการ (ไทย)',
  },
  {
    id: 'projectNameEng', disablePadding: false, label: 'ชื่อโครงการ (อังกฤษ)',
  },
  {
    id: 'acronyms', disablePadding: false, label: 'คำย่อประเภท',
  },
  {
    id: 'risk_type', disablePadding: false, label: 'ประเภทความเสี่ยง',
  },
  {
    id: 'deliveryOnlineDate', disablePadding: false, label: 'วันที่ส่งข้อเสนอออนไลน์',
  },
  {
    id: 'reviewRequestDate', disablePadding: false, label: 'วันที่ จนท.ตรวจคำขอ',
  },
  {
    id: 'resultDocReview', disablePadding: false, label: 'ผลการตรวจเอกสาร',
  },
  {
    id: 'committeeAssignDate', disablePadding: false, label: 'วันมอบหมายกรรมการ',
  },
  {
    id: 'committeeNameArray', disablePadding: false, label: '----------- ชื่อกรรมการ -----------', width: 550,
  },
  {
    id: 'committeeCommentDate', disablePadding: false, label: 'วันกรรมการส่งความเห็นและผล',
  },
  {
    id: 'meetingDate', disablePadding: false, label: 'วันที่เข้าที่ประชุม',
  },
  {
    id: 'meetingApprovalDate', disablePadding: false, label: 'วันที่มีมติรับรองโครงการ',
  },
  {
    id: 'considerResult', disablePadding: false, label: 'ผลการพิจารณา', width: 350,
  },
  {
    id: 'alertDate', disablePadding: false, label: 'วันแจ้งเตือน',
  },
  {
    id: 'requestEditDate', disablePadding: false, label: 'วันขอแก้ไขโครงการที่ผ่านการรับรอง',
  },
  {
    id: 'reportStatusDate', disablePadding: false, label: 'วันส่งรายงานความก้าวหน้า',
  },
  {
    id: 'certificateExpireDate', disablePadding: false, label: 'วันหมดอายุใบรับรอง',
  },
  {
    id: 'requestRenewDate', disablePadding: false, label: 'วันขอต่ออายุ',
  },
  {
    id: 'col20', disablePadding: false, label: 'Download เอกสาร',
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
