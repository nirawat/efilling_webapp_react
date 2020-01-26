import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Config from 'react-global-configuration';
import Axios from 'axios';
import NotificationSystem from 'rc-notification';
import { BasicNotification } from '../../../../../shared/components/Notification';
import renderDatePickerDefauleValueField from '../../../../../shared/components/form/DatePickerDefaultValue';
import renderSelectField from '../../../../../shared/components/form/Select';

Axios.defaults.baseURL = Config.get('axiosBaseUrl');
Axios.defaults.headers.common.Authorization = Config.get('axiosToken');
Axios.defaults.headers.common['Content-Type'] = Config.get('axiosContentType');

// const eFillingSys = JSON.parse(localStorage.getItem('efilling_system'));
const urlParams = new URLSearchParams(window.location.search);
let notificationRU = null;

class PagesForm extends PureComponent {
  static propTypes = {
    reset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      docDate: '',
      docNumber: '',
      sectionName: '',
      facultyName: '',
      departmentName: '',
      phone: '',
      fax: '',
      email: '',
      group1genus: '',
      group1species: '',
      group1riskHuman: '',
      group1riskAnimal: '',
      group1pathogens: '',
      group1virus: '',
      group1bacteria: '',
      group1paraSit: '',
      group1mold: '',
      group1protein: '',
      group2genus: '',
      group2species: '',
      group2riskHuman: '',
      group2riskAnimal: '',
      group2pathogens: '',
      group2virus: '',
      group2bacteria: '',
      group2paraSit: '',
      group2mold: '',
      group2protein: '',
      permissionInsert: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, (n) => { notificationRU = n; });
    this.setState({
      docDate: '',
      docNumber: '',
    });
    Axios
      .get(`PublicDocMenuE/MenuE1InterfaceData/${urlParams.get('RegisterId')}/${urlParams.get('Passw')}`)
      .then((resp) => {
        if (resp.data.userPermission !== null && !resp.data.userPermission.view) {
          window.location = '/efilling/forms/errors/permission';
        }
        this.setState({
          docDate: resp.data.docDate,
          docNumber: resp.data.docNumber,
          permissionInsert: resp.data.userPermission.insert,
        });
      });
  }

  componentWillUnmount() {
    notificationRU.destroy();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeGroup1RiskHuman = (e) => {
    this.setState({ group1riskHuman: e.value });
  }

  handleChangeGroup1RiskAnimal = (e) => {
    this.setState({ group1riskAnimal: e.value });
  }

  handleChangeGroup1Pathogens = (e) => {
    this.setState({ group1pathogens: e.value });
  }

  handleChangeGroup2RiskHuman = (e) => {
    this.setState({ group2riskHuman: e.value });
  }

  handleChangeGroup2RiskAnimal = (e) => {
    this.setState({ group2riskAnimal: e.value });
  }

  handleChangeGroup2Pathogens = (e) => {
    this.setState({ group2pathogens: e.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    console.log(this.state);

    Axios
      .post('/PublicDocMenuE/AddDocMenuE1', this.state)
      .then(() => {
        this.show('success', 'แจ้งให้ทราบ', `การแจ้งรายการ
        เชื้อโรคและพิษจากสัตว์เสร็จสิ้น!`);
        // this.handleReset();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

  handleReset = () => {
    const { reset } = this.props;
    this.setState({
      sectionName: '',
      facultyName: '',
      departmentName: '',
      phone: '',
      fax: '',
      email: '',
      group1genus: '',
      group1species: '',
      group1riskHuman: '',
      group1riskAnimal: '',
      group1pathogens: '',
      group1virus: '',
      group1bacteria: '',
      group1paraSit: '',
      group1mold: '',
      group1protein: '',
      group2genus: '',
      group2species: '',
      group2riskHuman: '',
      group2riskAnimal: '',
      group2pathogens: '',
      group2virus: '',
      group2bacteria: '',
      group2paraSit: '',
      group2mold: '',
      group2protein: '',
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

  render() {
    const {
      docNumber, sectionName, facultyName,
      departmentName, phone, fax, email,
      group1genus, group1species, group1virus,
      group1bacteria, group1paraSit, group1mold,
      group1protein, group2genus, group2species,
      group2virus, group2bacteria,
      group2paraSit, group2mold, group2protein,
      permissionInsert,
    } = this.state;

    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  วันที่แจ้งรายการ
                </span>
                <div className="form__form-group-field" style={{ backgroundColor: '#F2F4F7' }}>
                  <Field
                    name="docDate"
                    component={renderDatePickerDefauleValueField}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  หมายเลขแจ้งรายการ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="docNumber"
                    component="input"
                    type="text"
                    placeholder={docNumber}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ชื่อหน่วยงาน
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="sectionName"
                    component="input"
                    type="text"
                    value={sectionName}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  คณะ
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="facultyName"
                    component="input"
                    type="text"
                    value={facultyName}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  ภาควิชา
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="departmentName"
                    component="input"
                    type="text"
                    value={departmentName}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  โทรศัพท์
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="phone"
                    component="input"
                    type="text"
                    value={phone}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  โทรสาร
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="fax"
                    component="input"
                    type="text"
                    value={fax}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">
                  Email
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="email"
                    component="input"
                    type="text"
                    value={email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__half">
                <div className="card__title">
                  <h5 className="bold-text">เชื่อโรคที่ครอบครอง</h5>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Genus</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1genus"
                      component="input"
                      type="text"
                      value={group1genus}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Species</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1species"
                      component="input"
                      type="text"
                      value={group1species}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">กลุ่มเสี่ยงต่อคน</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1riskHuman"
                      component={renderSelectField}
                      onChange={this.handleChangeGroup1RiskHuman}
                      options={[
                        { value: '1', label: 'กลุ่มเสี่ยงต่อคน 1' },
                        { value: '2', label: 'กลุ่มเสี่ยงต่อคน 2' },
                        { value: '3', label: 'กลุ่มเสี่ยงต่อคน 3' },
                        { value: '4', label: 'กลุ่มเสี่ยงต่อคน 4' },
                        { value: '5', label: 'กลุ่มเสี่ยงต่อคน 5' },
                      ]}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">กลุ่มเสี่ยงต่อสัตว์</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1riskAnimal"
                      component={renderSelectField}
                      onChange={this.handleChangeGroup1RiskAnimal}
                      options={[
                        { value: '1', label: 'กลุ่มเสี่ยงต่อสัตว์ 1' },
                        { value: '2', label: 'กลุ่มเสี่ยงต่อสัตว์ 2' },
                        { value: '3', label: 'กลุ่มเสี่ยงต่อสัตว์ 3' },
                        { value: '4', label: 'กลุ่มเสี่ยงต่อสัตว์ 4' },
                        { value: '5', label: 'กลุ่มเสี่ยงต่อสัตว์ 5' },
                      ]}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ชนิดของเชื้อก่อโรค</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1pathogens"
                      component={renderSelectField}
                      onChange={this.handleChangeGroup1Pathogens}
                      options={[
                        { value: '1', label: 'ไวรัส' },
                        { value: '2', label: 'แบคทีเรีย' },
                        { value: '3', label: 'ปาราสิต' },
                        { value: '4', label: 'รา' },
                        { value: '5', label: 'โปรตีนก่อโรค' },
                      ]}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ไวรัส</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1virus"
                      component="input"
                      type="text"
                      value={group1virus}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">แบคทีเรีย</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1bacteria"
                      component="input"
                      type="text"
                      value={group1bacteria}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ปาราสิต</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1paraSit"
                      component="input"
                      type="text"
                      value={group1paraSit}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">รา</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1mold"
                      component="input"
                      type="text"
                      value={group1mold}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">โปรตีนก่อโรค</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group1protein"
                      component="input"
                      type="text"
                      value={group1protein}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div style={{ paddingRight: '20px', color: '#fff' }}>.</div>
              <div className="form__half">
                <div className="card__title">
                  <h5 className="bold-text">พิษจากสัตว์ครอบครอง</h5>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Genus</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2genus"
                      component="input"
                      type="text"
                      value={group2genus}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Species</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2species"
                      component="input"
                      type="text"
                      value={group2species}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">กลุ่มเสี่ยงต่อคน</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2riskHuman"
                      component={renderSelectField}
                      onChange={this.handleChangeGroup2RiskHuman}
                      options={[
                        { value: '1', label: 'กลุ่มเสี่ยงต่อคน 1' },
                        { value: '2', label: 'กลุ่มเสี่ยงต่อคน 2' },
                        { value: '3', label: 'กลุ่มเสี่ยงต่อคน 3' },
                        { value: '4', label: 'กลุ่มเสี่ยงต่อคน 4' },
                        { value: '5', label: 'กลุ่มเสี่ยงต่อคน 5' },
                      ]}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">กลุ่มเสี่ยงต่อสัตว์</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2riskAnimal"
                      component={renderSelectField}
                      onChange={this.handleChangeGroup2RiskAnimal}
                      options={[
                        { value: '1', label: 'กลุ่มเสี่ยงต่อสัตว์ 1' },
                        { value: '2', label: 'กลุ่มเสี่ยงต่อสัตว์ 2' },
                        { value: '3', label: 'กลุ่มเสี่ยงต่อสัตว์ 3' },
                        { value: '4', label: 'กลุ่มเสี่ยงต่อสัตว์ 4' },
                        { value: '5', label: 'กลุ่มเสี่ยงต่อสัตว์ 5' },
                      ]}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ชนิดของเชื้อก่อโรค</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2pathogens"
                      component={renderSelectField}
                      onChange={this.handleChangeGroup2Pathogens}
                      options={[
                        { value: '1', label: 'ไวรัส' },
                        { value: '2', label: 'แบคทีเรีย' },
                        { value: '3', label: 'ปาราสิต' },
                        { value: '4', label: 'รา' },
                        { value: '5', label: 'โปรตีนก่อโรค' },
                      ]}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ไวรัส</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2virus"
                      component="input"
                      type="text"
                      value={group2virus}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">แบคทีเรีย</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2bacteria"
                      component="input"
                      type="text"
                      value={group2bacteria}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">ปาราสิต</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2paraSit"
                      component="input"
                      type="text"
                      value={group2paraSit}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">รา</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2mold"
                      component="input"
                      type="text"
                      value={group2mold}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">โปรตีนก่อโรค</span>
                  <div className="form__form-group-field">
                    <Field
                      name="group2protein"
                      component="input"
                      type="text"
                      value={group2protein}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form__form-group">
                <ButtonToolbar>
                  <Button color="success" type="submit" disabled={!permissionInsert}>บันทึก</Button>
                  <Button onClick={this.handleReset}>ล้าง</Button>
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
  form: 'pages_a2_form', // a unique identifier for this form
})(withTranslation('common')(PagesForm));
