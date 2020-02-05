import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import { Link } from 'react-router-dom';
import Config from 'react-global-configuration';
import Axios from 'axios';
import classNames from 'classnames';
import nl2br from 'react-newline-to-break';
import { RTLProps } from '../../../../../shared/prop-types/ReducerProps';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

class ModalComponent extends PureComponent {
  static propTypes = {
    isClosed: PropTypes.bool,
    docId: PropTypes.string,
    meetingOfRound: PropTypes.string,
    meetingOfYear: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string.isRequired,
    colored: PropTypes.bool,
    header: PropTypes.bool,
    btn: PropTypes.string.isRequired,
    rtl: RTLProps.isRequired,
  };

  static defaultProps = {
    isClosed: false,
    meetingOfRound: '',
    meetingOfYear: '',
    title: '',
    docId: '',
    colored: false,
    header: false,
  };

  constructor() {
    super();
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  downloadAllReport = () => {
    const {
      docId, meetingOfRound, meetingOfYear,
    } = this.props;
    Axios
      .get(`PublicDocMenuReport/GetAllReportMeeting/${docId}/${meetingOfRound}/${meetingOfYear}`)
      .then((resp) => {
        if (resp.data === null) {
          this.show('warning', 'แจ้งให้ทราบ', 'ไม่พบไฟล์รายงาน!');
        } else {
          const url = resp.data.filebase1464;
          const a = document.createElement('a');
          a.href = url;
          a.download = resp.data.filename14;
          a.click();
        }
      });
  }

  downloadCloseMeeting = () => {
    Axios
      .post('PublicDocMenuC/CloseMeeting', this.props)
      .then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        if (error.response) {
          this.show('danger', 'Error', error.message);
        }
      });
  }

  toggle() {
    this.setState(prevState => ({ modal: !prevState.modal }));
  }

  render() {
    const {
      color, btn, isClosed, docId, meetingOfRound, meetingOfYear, title, colored, header, rtl,
    } = this.props;
    const { modal } = this.state;
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
        <Link to="/forms/menuC/menuC3_Report" onClick={this.toggle}>{btn}</Link>
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
            กรุณาเลือกทำรายการโดยหมายเลขทำรายการของท่านคือ {nl2br(docId)} ปี {nl2br(meetingOfYear)} ครั้งที่ {nl2br(meetingOfRound)}
          </div>
          <ButtonToolbar className="modal__footer">
            <Button color="success" disabled={isClosed} onClick={() => this.downloadCloseMeeting()}>พิมพ์ร่าง</Button>{' '}
            <Button color="success" onClick={() => this.downloadAllReport()}>พิมพ์จริง</Button>{' '}
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
