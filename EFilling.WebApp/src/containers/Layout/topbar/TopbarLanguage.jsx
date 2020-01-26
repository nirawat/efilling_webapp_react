import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { Collapse } from 'reactstrap';
import DownIcon from 'mdi-react/ChevronDownIcon';
import PropTypes from 'prop-types';

const th = `${process.env.PUBLIC_URL}/img/language/th.png`;
const gb = `${process.env.PUBLIC_URL}/img/language/gb.png`;

const ThLng = () => (
  <span className="topbar__language-btn-title">
    <img src={th} alt="th" />
    <span>TH</span>
  </span>
);

const GbLng = () => (
  <span className="topbar__language-btn-title">
    <img src={gb} alt="gb" />
    <span>EN</span>
  </span>
);

class TopbarLanguage extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({ changeLanguage: PropTypes.func }).isRequired,
  };

  constructor() {
    super();
    this.state = {
      collapse: false,
      mainButtonContent: <ThLng />,
    };
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  changeLanguage = (lng) => {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
    switch (lng) {
      case 'th':
        this.setState({ mainButtonContent: <ThLng /> });
        break;
      case 'en':
        this.setState({ mainButtonContent: <GbLng /> });
        break;
      default:
        this.setState({ mainButtonContent: <GbLng /> });
        break;
    }
  };

  render() {
    const { mainButtonContent, collapse } = this.state;

    return (
      <div className="topbar__collapse topbar__collapse--language">
        <button className="topbar__btn" type="button" onClick={this.toggle}>
          {mainButtonContent}
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && <button className="topbar__back" type="button" onClick={this.toggle} />}
        <Collapse
          isOpen={collapse}
          className="topbar__collapse-content topbar__collapse-content--language"
        >
          <button
            className="topbar__language-btn"
            type="button"
            onClick={() => this.changeLanguage('th')}
          >
            <ThLng />
          </button>
          <button
            className="topbar__language-btn"
            type="button"
            onClick={() => this.changeLanguage('en')}
          >
            <GbLng />
          </button>
        </Collapse>
      </div>
    );
  }
}

export default withTranslation('common')(TopbarLanguage);
