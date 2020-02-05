import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderSelectField from '../../../../../shared/components/form/Select';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
let notificationRU = null;

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      createBy: eFillingSys.registerId,
      listMeetingId: [],
      meetingId: '',
      meetingName: '',
      tab5Group1Seq1Input1: '',
      tab5Group1Seq1Input2: '',
      tab5Group1Seq1Input3: '',
      tab5Group1Seq2Input1: '',
      tab5Group1Seq2Input2: '',
      tab5Group1Seq2Input3: '',
      tab5Group1Seq3Input1: '',
      tab5Group1Seq3Input2: '',
      tab5Group1Seq3Input3: '',
      tab5Group1Seq4Input1: '',
      tab5Group1Seq4Input2: '',
      tab5Group1Seq4Input3: '',
      tab5Group1Seq5Input1: '',
      tab5Group1Seq5Input2: '',
      tab5Group1Seq5Input3: '',
      tab5Group1Seq6Input1: '',
      tab5Group1Seq6Input2: '',
      tab5Group1Seq6Input3: '',
      tab5Group1Seq7Input1: '',
      tab5Group1Seq7Input2: '',
      tab5Group1Seq7Input3: '',
      tab5Group1Seq8Input1: '',
      tab5Group1Seq8Input2: '',
      tab5Group1Seq8Input3: '',
      tab5Group1Seq9Input1: '',
      tab5Group1Seq9Input2: '',
      tab5Group1Seq9Input3: '',
      tab5Group1Seq10Input1: '',
      tab5Group1Seq10Input2: '',
      tab5Group1Seq10Input3: '',
      permissionInsert: false,
      buttonSaveEnable: false,
      buttonSaveStatus: 'บันทึก',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      listMeetingId: [],
      meetingId: '',
      meetingName: '',
    });
    let initialMeetingId = [];
    Axios
      .get(`PublicDocMenuC/MenuC35InterfaceData/${eFillingSys.registerId}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        if (resp.data.listMeetingId != null) {
          initialMeetingId = resp.data.listMeetingId.map((e) => {
            initialMeetingId = [];
            return e;
          });
        }
        this.setState({
          listMeetingId: initialMeetingId,
          meetingId: resp.data.meetingId,
          meetingName: resp.data.meetingName,
          permissionInsert: resp.data.userPermission.insert,
          buttonSaveEnable: resp.data.userPermission.insert,
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.show('warning', 'แจ้งให้ทราบ', 'กรุณารอสักครู่ระบบกำลังบันทึกข้อมูล...');
    this.setState({
      buttonSaveStatus: 'กำลังบันทึก...',
      buttonSaveEnable: false,
    });
    Axios
      .post('/PublicDocMenuC/AddDocMenuC35', this.state)
      .then(() => {
        this.show('success', 'บันทึก', `
        ระเบียบวาระที่ 5 เสร็จสิ้น!`);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        const { permissionInsert } = this.state;
        this.setState({
          buttonSaveStatus: 'บันทึก',
          buttonSaveEnable: permissionInsert,
        });
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

  handleChangeMeetingId = (e) => {
    this.setState({ meetingId: e.value });
  }

  handleReset = () => {
    const { reset } = this.props;
    this.setState({
      meetingId: '',
      meetingName: '',
      tab5Group1Seq1Input1: '',
      tab5Group1Seq1Input2: '',
      tab5Group1Seq1Input3: '',
      tab5Group1Seq2Input1: '',
      tab5Group1Seq2Input2: '',
      tab5Group1Seq2Input3: '',
      tab5Group1Seq3Input1: '',
      tab5Group1Seq3Input2: '',
      tab5Group1Seq3Input3: '',
      tab5Group1Seq4Input1: '',
      tab5Group1Seq4Input2: '',
      tab5Group1Seq4Input3: '',
      tab5Group1Seq5Input1: '',
      tab5Group1Seq5Input2: '',
      tab5Group1Seq5Input3: '',
      tab5Group1Seq6Input1: '',
      tab5Group1Seq6Input2: '',
      tab5Group1Seq6Input3: '',
      tab5Group1Seq7Input1: '',
      tab5Group1Seq7Input2: '',
      tab5Group1Seq7Input3: '',
      tab5Group1Seq8Input1: '',
      tab5Group1Seq8Input2: '',
      tab5Group1Seq8Input3: '',
      tab5Group1Seq9Input1: '',
      tab5Group1Seq9Input2: '',
      tab5Group1Seq9Input3: '',
      tab5Group1Seq10Input1: '',
      tab5Group1Seq10Input2: '',
      tab5Group1Seq10Input3: '',
      permissionInsert: false,
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

  getTab5Group1Input1 = (index, data) => {
    switch (index) {
      case 1:
        this.setState({ tab5Group1Seq1Input1: data });
        break;
      case 2:
        this.setState({ tab5Group1Seq2Input1: data });
        break;
      case 3:
        this.setState({ tab5Group1Seq3Input1: data });
        break;
      case 4:
        this.setState({ tab5Group1Seq4Input1: data });
        break;
      case 5:
        this.setState({ tab5Group1Seq5Input1: data });
        break;
      case 6:
        this.setState({ tab5Group1Seq6Input1: data });
        break;
      case 7:
        this.setState({ tab5Group1Seq7Input1: data });
        break;
      case 8:
        this.setState({ tab5Group1Seq8Input1: data });
        break;
      case 9:
        this.setState({ tab5Group1Seq9Input1: data });
        break;
      case 10:
        this.setState({ tab5Group1Seq10Input1: data });
        break;
      default:
        return null;
    }
    return null;
  }

  getTab5Group1Input2 = (index, data) => {
    switch (index) {
      case 1:
        this.setState({ tab5Group1Seq1Input2: data });
        break;
      case 2:
        this.setState({ tab5Group1Seq2Input2: data });
        break;
      case 3:
        this.setState({ tab5Group1Seq3Input2: data });
        break;
      case 4:
        this.setState({ tab5Group1Seq4Input2: data });
        break;
      case 5:
        this.setState({ tab5Group1Seq5Input2: data });
        break;
      case 6:
        this.setState({ tab5Group1Seq6Input2: data });
        break;
      case 7:
        this.setState({ tab5Group1Seq7Input2: data });
        break;
      case 8:
        this.setState({ tab5Group1Seq8Input2: data });
        break;
      case 9:
        this.setState({ tab5Group1Seq9Input2: data });
        break;
      case 10:
        this.setState({ tab5Group1Seq10Input2: data });
        break;
      default:
        return null;
    }
    return null;
  }

  getTab5Group1Input3 = (index, data) => {
    switch (index) {
      case 1:
        this.setState({ tab5Group1Seq1Input3: data });
        break;
      case 2:
        this.setState({ tab5Group1Seq2Input3: data });
        break;
      case 3:
        this.setState({ tab5Group1Seq3Input3: data });
        break;
      case 4:
        this.setState({ tab5Group1Seq4Input3: data });
        break;
      case 5:
        this.setState({ tab5Group1Seq5Input3: data });
        break;
      case 6:
        this.setState({ tab5Group1Seq6Input3: data });
        break;
      case 7:
        this.setState({ tab5Group1Seq7Input3: data });
        break;
      case 8:
        this.setState({ tab5Group1Seq8Input3: data });
        break;
      case 9:
        this.setState({ tab5Group1Seq9Input3: data });
        break;
      case 10:
        this.setState({ tab5Group1Seq10Input3: data });
        break;
      default:
        return null;
    }
    return null;
  }

  handleRemoveTab5Group1 = (index) => {
    switch (index) {
      case 1:
        this.setState({
          tab5Group1Seq1Input1: '',
          tab5Group1Seq1Input2: '',
          tab5Group1Seq1Input3: '',
        });
        break;
      case 2:
        this.setState({
          tab5Group1Seq2Input1: '',
          tab5Group1Seq2Input2: '',
          tab5Group1Seq2Input3: '',
        });
        break;
      case 3:
        this.setState({
          tab5Group1Seq3Input1: '',
          tab5Group1Seq3Input2: '',
          tab5Group1Seq3Input3: '',
        });
        break;
      case 4:
        this.setState({
          tab5Group1Seq4Input1: '',
          tab5Group1Seq4Input2: '',
          tab5Group1Seq4Input3: '',
        });
        break;
      case 5:
        this.setState({
          tab5Group1Seq5Input1: '',
          tab5Group1Seq5Input2: '',
          tab5Group1Seq5Input3: '',
        });
        break;
      case 6:
        this.setState({
          tab5Group1Seq6Input1: '',
          tab5Group1Seq6Input2: '',
          tab5Group1Seq6Input3: '',
        });
        break;
      case 7:
        this.setState({
          tab5Group1Seq7Input1: '',
          tab5Group1Seq7Input2: '',
          tab5Group1Seq7Input3: '',
        });
        break;
      case 8:
        this.setState({
          tab5Group1Seq8Input1: '',
          tab5Group1Seq8Input2: '',
          tab5Group1Seq8Input3: '',
        });
        break;
      case 9:
        this.setState({
          tab5Group1Seq9Input1: '',
          tab5Group1Seq9Input2: '',
          tab5Group1Seq9Input3: '',
        });
        break;
      case 10:
        this.setState({
          tab5Group1Seq10Input1: '',
          tab5Group1Seq10Input2: '',
          tab5Group1Seq10Input3: '',
        });
        break;
      default:
        return null;
    }
    return '';
  }

  render() {
    const {
      listMeetingId, meetingName, buttonSaveEnable, buttonSaveStatus,
    } = this.state;

    const renderTab5 = ({ fields }) => (
      <ul>
        <Button color="primary" size="sm" onClick={() => fields.push({})}>
          + เพิ่มวาระอื่นๆ
        </Button>
        {fields.map((member, index) => (
          <li key={index.toString()} disabled>
            <div className="form__form-group">
              <span className="form__form-group-label">เรื่องที่</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}.input1`}
                  component="input"
                  type="text"
                  onChange={(event, value) => this.getTab5Group1Input1(index + 1, value)}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">สรุปเรื่อง</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}.input2`}
                  component="textarea"
                  onChange={(event, value) => this.getTab5Group1Input2(index + 1, value)}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">มติ</span>
              <div className="form__form-group-field">
                <Field
                  name={`${member}.input3`}
                  component="textarea"
                  onChange={(event, value) => this.getTab5Group1Input3(index + 1, value)}
                />
              </div>
            </div>
            <Button color="danger" size="sm" onClick={() => { fields.remove(index); this.handleRemoveTab5Group1(index + 1); }}>
              ลบ
            </Button>
          </li>
        ))}
      </ul>
    );

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="card__title">
                <h5 className="bold-text">โครงการวิจัยที่รับรองหลังปรับปรุงแก้ไข</h5>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">วาระการประชุม (ครั้งที่)</span>
                <div className="form__form-group-field">
                  <Field
                    name="meetingId"
                    component={renderSelectField}
                    onChange={this.handleChangeMeetingId}
                    placeholder={meetingName}
                    options={listMeetingId}
                  />
                </div>
              </div>
              <div className="card__title">
                <h5 className="bold-text">เรื่องอื่นๆ</h5>
              </div>
              <div className="form__form-group">
                <FieldArray name="tab5Group1" component={renderTab5} />
              </div>
              <div className="form__form-group">
                <ButtonToolbar>
                  <Button color="success" type="submit" disabled={!buttonSaveEnable}>{buttonSaveStatus}</Button>
                  <Button onClick={() => window.location.reload()}>ล้าง</Button>
                </ButtonToolbar>
              </div>
            </form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'pages_b1_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
