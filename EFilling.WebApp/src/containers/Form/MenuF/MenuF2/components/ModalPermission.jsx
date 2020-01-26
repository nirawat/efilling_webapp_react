import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Col, Button, ButtonToolbar, Modal,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Config from 'react-global-configuration';
import Axios from 'axios';
import classNames from 'classnames';
// import nl2br from 'react-newline-to-break';
import { RTLProps } from '../../../../../shared/prop-types/ReducerProps';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

class ModalComponent extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    userGroupX: PropTypes.string,
    menuCodeX: PropTypes.string,
    color: PropTypes.string.isRequired,
    colored: PropTypes.bool,
    header: PropTypes.bool,
    btn: PropTypes.string.isRequired,
    rtl: RTLProps.isRequired,
  };

  static defaultProps = {
    title: '',
    userGroupX: '',
    menuCodeX: '',
    colored: false,
    header: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      userGroup: props.userGroupX,
      menuPageCode: props.menuCodeX,
      pmView: false,
      pmInsert: false,
      pmUpdate: false,
      pmPrint: false,
      pmAllData: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.getPermission();
  }

  getPermission = () => {
    const { userGroupX, menuCodeX } = this.props;
    Axios
      .get(`PublicDocMenuF/GetUserEditPermissionF2/${userGroupX}/${menuCodeX}`)
      .then((resp) => {
        this.setState({
          pmView: resp.data.pmview,
          pmInsert: resp.data.pminsert,
          pmUpdate: resp.data.pmupdate,
          pmPrint: resp.data.pmprint,
          pmAllData: resp.data.pmalldata,
        });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Axios
      .post('/PublicDocMenuF/UpdatePermissionGroup', this.state)
      .then(() => {
        this.setState(prevState => ({ modal: !prevState.modal }));
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            this.show('danger', 'ข้อผิดผลาด!', 'กรุณาตรวจสอบข้อมูลของท่าน');
          } else {
            this.show('danger', 'Error', error.message);
          }
        } else {
          this.show('danger', 'Error', error.message);
        }
      });
  }

  changePmView() {
    this.setState(prevState => ({ pmView: !prevState.pmView }));
  }

  changePmInsert() {
    this.setState(prevState => ({ pmInsert: !prevState.pmInsert }));
  }

  changePmUpdate() {
    this.setState(prevState => ({ pmUpdate: !prevState.pmUpdate }));
  }

  changePmPrint() {
    this.setState(prevState => ({ pmPrint: !prevState.pmPrint }));
  }

  changePmAllData() {
    this.setState(prevState => ({ pmAllData: !prevState.pmAllData }));
  }

  toggle() {
    this.setState(prevState => ({ modal: !prevState.modal }));
  }

  render() {
    const {
      color, btn, title, colored, header, rtl,
    } = this.props;
    const {
      modal,
      pmView, pmInsert, pmUpdate, pmPrint, pmAllData,
    } = this.state;
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
        <Link to="/forms/menuF/menuF2" onClick={this.toggle}>{btn}</Link>
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
            <Col md={12} lg={12}>
              <form className="form form--horizontal">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <input
                      name="pmView"
                      component="input"
                      type="checkbox"
                      checked={pmView}
                      onChange={() => this.changePmView()}
                      style={{ width: '20px' }}
                    />
                    <span className="checkbox-btn__label form__form-group-label" style={{ width: '300px' }}>สิทธิ์เข้าถึงหน้าจอ</span>
                  </div>
                </div>
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <input
                      name="pmInsert"
                      component="input"
                      type="checkbox"
                      checked={pmInsert}
                      onChange={() => this.changePmInsert()}
                      style={{ width: '20px' }}
                    />
                    <span className="checkbox-btn__label form__form-group-label" style={{ width: '300px' }}>สิทธิ์เพิ่มข้อมูล</span>
                  </div>
                </div>
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <input
                      name="pmUpdate"
                      component="input"
                      type="checkbox"
                      checked={pmUpdate}
                      onChange={() => this.changePmUpdate()}
                      style={{ width: '20px' }}
                    />
                    <span className="checkbox-btn__label form__form-group-label" style={{ width: '300px' }}>สิทธิ์แก้ไขข้อมูล</span>
                  </div>
                </div>
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <input
                      name="pmPrint"
                      component="input"
                      type="checkbox"
                      checked={pmPrint}
                      onChange={() => this.changePmPrint()}
                      style={{ width: '20px' }}
                    />
                    <span className="checkbox-btn__label form__form-group-label" style={{ width: '300px' }}>สิทธิ์พิมพ์เอกสาร/ดาวน์โหลด</span>
                  </div>
                </div>
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <input
                      name="pmAllData"
                      component="input"
                      type="checkbox"
                      checked={pmAllData}
                      onChange={() => this.changePmAllData()}
                      style={{ width: '20px' }}
                    />
                    <span className="checkbox-btn__label form__form-group-label" style={{ width: '300px' }}>สิทธิ์เข้าถึงข้อมูลบุคคลอื่น</span>
                  </div>
                </div>
              </form>
            </Col>
          </div>
          <ButtonToolbar className="modal__footer">
            <Button color="success" type="submit" onClick={this.handleSubmit}>บันทึก</Button>
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
