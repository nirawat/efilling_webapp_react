import React, { PureComponent } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PropTypes from 'prop-types';

export default class CodeHighlither extends PureComponent {
  static propTypes = {
    scss: PropTypes.bool,
    children: PropTypes.string.isRequired,
  };

  static defaultProps = {
    scss: false,
  };

  render() {
    const { scss, children } = this.props;

    return (
      <SyntaxHighlighter showLineNumbers language={scss ? 'scss' : 'jsx'} style={darcula}>
        {children}
      </SyntaxHighlighter>
    );
  }
}
