/* eslint-disable react/no-children-prop */
import React, { PureComponent } from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const renderTextField = ({
  input, label, meta: { touched, error }, children, select,
}) => (
  <TextField
    className="material-form__field"
    label={label}
    error={touched && error}
    children={children}
    value={input.value}
    select={select}
    onChange={(e) => {
      e.preventDefault();
      input.onChange(e.target.value);
    }}
  />
);

renderTextField.propTypes = {
  input: PropTypes.shape().isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  select: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
};

renderTextField.defaultProps = {
  meta: null,
  label: '',
  select: false,
  children: [],
};

class ProfileSettings1 extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  render() {
    const { handleSubmit, reset } = this.props;
    return (
      <form className="material-form" onSubmit={handleSubmit}>
        <div>
          <span className="material-form__label">ชื่อ-นามสกุล</span>
          <Field
            name="txtname"
            component={renderTextField}
            placeholder="ชื่อ-นามสกุล"
          />
        </div>
        <div>
          <span className="material-form__label">รหัสประจำตัวประชาชน / Passport No</span>
          <Field
            name="txtpassport"
            component={renderTextField}
            placeholder="รหัสประจำตัวประชาชน"
          />
        </div>
        <div>
          <span className="material-form__label">ที่อยู่</span>
          <Field
            name="txtaddress"
            component={renderTextField}
            placeholder="ที่อยู่"
            multiline
            rowsMax="4"
          />
        </div>
        <div>
          <span className="material-form__label">อีเมล์</span>
          <Field
            name="txtemail"
            component={renderTextField}
            placeholder="example@email.com"
            type="email"
          />
        </div>
        <div>
          <span className="material-form__label">อาชีพ</span>
          <Field
            name="txtcaree"
            component={renderTextField}
            placeholder="อาชีพ"
          />
        </div>
        <div>
          <span className="material-form__label">เลขที่ใบประกอบอาชีพ (ถ้ามี)</span>
          <Field
            name="txtoccupationnumber"
            component={renderTextField}
            placeholder="เลขที่ใบประกอบอาชีพ (ถ้ามี)"
          />
        </div>
        <div>
          <span className="material-form__label">หน่วยงานที่สังกัด</span>
          <Field
            name="txtsection"
            component={renderTextField}
            placeholder="หน่วยงานที่สังกัด"
          />
        </div>
        <div>
          <span className="material-form__label">ลงทะเบียนในฐานะ</span>
          <Field
            name="select"
            component={renderTextField}
            select
          >
            <MenuItem className="material-form__option" value="1">นักวิจัย</MenuItem>
            <MenuItem className="material-form__option" value="2">เจ้าหน้าที่บริหาร</MenuItem>
            <MenuItem className="material-form__option" value="3">กรรมการผู้พิจารณา</MenuItem>
          </Field>
        </div>
        <ButtonToolbar className="form__button-toolbar">
          <Button color="success" type="submit">บันทึก</Button>
          <Button type="button" onClick={reset}>
            เคลียร์
          </Button>
        </ButtonToolbar>
      </form>
    );
  }
}

export default reduxForm({
  form: 'profile_settings_1', // a unique identifier for this form
})(ProfileSettings1);
