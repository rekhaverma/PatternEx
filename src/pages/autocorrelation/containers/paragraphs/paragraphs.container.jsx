import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

import { zeppelinParagraphsAsArray } from 'model/selectors';

import Paragraph from '../../components/paragraph';

class Paragraphs extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {};
  }

  render() {
    if (this.props.paragraphs.length === 0) {
      return <span>No paragraphs available.</span>;
    }

    return (
      <Scrollbars
        autoHeight
        autoHeightMax={this.props.clientHeight}
      >
        {
          this.props.paragraphs.map(el => (
            <Paragraph
              key={el.id}
              title={el.jobName}
              status={el.status}
              dateUpdated={el.dateUpdated}
              dateStarted={el.dateStarted}
              dateFinished={el.dateFinished}
              results={el.results}
            />
          ))
        }
      </Scrollbars>
    );
  }
}
Paragraphs.propTypes = {
  'clientHeight': PropTypes.number.isRequired,
  'paragraphs': PropTypes.array,
};
Paragraphs.defaultProps = {
  'paragraphs': [],
};

const mapStateToProps = state => ({
  'paragraphs': zeppelinParagraphsAsArray(state),
});

export default connect(mapStateToProps)(Paragraphs);
