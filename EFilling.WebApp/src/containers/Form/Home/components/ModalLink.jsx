import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import { Link } from 'react-router-dom';
import Config from 'react-global-configuration';
import classNames from 'classnames';
import Axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { RTLProps } from '../../../../shared/prop-types/ReducerProps';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

let counter = 0;

class ModalComponent extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    userid: PropTypes.string,
    projectnumber: PropTypes.string,
    color: PropTypes.string.isRequired,
    colored: PropTypes.bool,
    header: PropTypes.bool,
    btn: PropTypes.string.isRequired,
    rtl: RTLProps.isRequired,
  };

  static defaultProps = {
    title: '',
    userid: '',
    projectnumber: '',
    colored: false,
    header: false,
  };

  constructor() {
    super();
    this.state = {
      modal: false,
      data: [],
    };

    this.toggle = this.toggle.bind(this);
  }

  handleClickEditData = (docId) => {
    window.open(`/forms/menuC/menuC2_Edit?id=${docId}`, '_blank');
  }

  handleResultNote() {
    const { userid, projectnumber } = this.props;
    this.setState({
      data: [],
    });
    let initialComment = [];
    const rows = [];
    Axios
      .get(`PublicDocMenuHome/GetResultNoteHome1/${projectnumber}/${userid}`)
      .then((resp) => {
        if (resp.data != null) {
          initialComment = resp.data.map((e) => {
            initialComment = [];
            return e;
          });
        }
        for (let i = 0; i < initialComment.length; i += 1) {
          counter += 1;
          rows.push({
            id: counter,
            docid: initialComment[i].docid,
            xseq: initialComment[i].xseq,
            xdate: initialComment[i].xdate,
            xassignName: initialComment[i].xassignName,
            xriskName: initialComment[i].xriskName,
            xapprovalName: initialComment[i].xapprovalName,
            seq: initialComment[i].seq,
            date: initialComment[i].date,
            assignName: initialComment[i].assignName,
            riskName: initialComment[i].riskName,
            approvalName: initialComment[i].approvalName,
            commentDetail: initialComment[i].commentDetail,
          });
        }
        this.setState({ data: rows });
      });
  }

  toggle() {
    this.setState(prevState => ({ modal: !prevState.modal }));
    this.handleResultNote();
  }

  render() {
    const {
      color, btn, title, colored, header, rtl,
    } = this.props;
    const { modal, data } = this.state;
    let Icon;

    switch (color) {
      case 'primary':
        Icon = <span className="lnr lnr-pushpin modal__title-icon" />;
        break;
      case 'success':
        Icon = <span className="lnr lnr-thumbs-up modal__title-icon" />;
        break;
      case 'warning':
        Icon = <span className="lnr lnr-flag modal__title-icon" />;
        break;
      case 'danger':
        Icon = <span className="lnr lnr-cross-circle modal__title-icon" />;
        break;
      default:
        break;
    }
    const modalClass = classNames({
      'modal-dialog--colored': colored,
      'modal-dialog--header': header,
    });

    return (
      <div>
        <Link to="/forms/home" onClick={this.toggle}>{btn}</Link>
        <Modal
          isOpen={modal}
          toggle={this.toggle}
          modalClassName={`${rtl.direction}-support`}
          className={`modal-dialog--${color} ${modalClass}`}
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.toggle} />
            {header ? '' : Icon}
            <h4 className="text-modal  modal__title">{title}</h4>
          </div>
          <div className="modal__body">
            <div className="material-table__wrap">
              <Table className="material-table">
                <TableBody>
                  {data
                    .map((d) => {
                      const xxx = '';
                      return (
                        <TableRow
                          className="material-table__row"
                          tabIndex={-1}
                          key={d.id}
                        >
                          <TableCell className="material-table__cell material-table__cell-left" style={{ verticalAlign: 'top' }}>
                            <h5>{d.xdate}</h5>
                            <h5>{d.xassignName} </h5>
                            <h5>{d.xriskName}</h5>
                            <h5>{d.xapprovalName}</h5>
                            <h5>{d.xcommentDetail}</h5>
                            <Button size="sm" color="success" onClick={() => this.handleClickEditData(d.docid)}>รายละเอียด</Button>
                          </TableCell>
                          <TableCell className="material-table__cell material-table__cell-left" style={{ verticalAlign: 'top' }}>
                            <h5>{d.date}</h5>
                            <h5>{d.assignName} </h5>
                            <h5>{d.riskName}</h5>
                            <h5>{d.approvalName}</h5>
                            <h5>{d.commentDetail}{xxx}</h5>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
          <ButtonToolbar className="modal__footer">
            <Button className="modal_cancel" onClick={this.toggle}>Cancel</Button>{' '}
          </ButtonToolbar>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({
  rtl: state.rtl,
}))(ModalComponent);
