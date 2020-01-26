/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class FileInputField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  };

  render() {
    const { onChange, name } = this.props;

    return (
      <div>
        {/* TODO turn back label */}
        {/* <label htmlFor={name}>Choose the file</label> */}
        <input
          type="file"
          name={name}
          id={name}
          accept="application/pdf,application/gzip,image/jpeg"
          onChange={
            (e) => {
              e.preventDefault();
              const files = [...e.target.files];
              if (files[0] !== undefined) {
                // convert files to an array
                onChange({ file: files[0], name: files[0].name });
              }
            }
          }
        />
      </div>
    );
  }
}

const renderFileInputField = (props) => {
  const { input, meta } = props;
  return (
    <div>
      <FileInputField {...input} />
      {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
    </div>
  );
};

renderFileInputField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

renderFileInputField.defaultProps = {
  meta: null,
};

export default renderFileInputField;
