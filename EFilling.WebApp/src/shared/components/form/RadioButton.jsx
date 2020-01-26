/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import * as PropTypes from 'prop-types';

class RadioButtonField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    defaultChecked: PropTypes.bool,
    radioValue: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    defaultChecked: false,
    radioValue: '',
  };

  componentDidMount() {
    const { defaultChecked, onChange, radioValue } = this.props;
    if (defaultChecked) {
      onChange(radioValue);
    }
  }

  onChange = () => {
    const { onChange, radioValue } = this.props;
    onChange(radioValue);
  };

  render() {
    const {
      label,
    } = this.props;

    return (
      <span className="radio-btn__label">{label}</span>
    );
  }
}

const renderRadioButtonField = (props) => {
  const {
    input, label, defaultChecked, disabled, className, radioValue,
  } = props;
  return (
    <RadioButtonField
      {...input}
      label={label}
      defaultChecked={defaultChecked}
      disabled={disabled}
      radioValue={radioValue}
      className={className}
    />
  );
};

renderRadioButtonField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  radioValue: PropTypes.string,
  className: PropTypes.string,
};

renderRadioButtonField.defaultProps = {
  label: '',
  defaultChecked: false,
  disabled: false,
  radioValue: '',
  className: '',
};

export default renderRadioButtonField;
