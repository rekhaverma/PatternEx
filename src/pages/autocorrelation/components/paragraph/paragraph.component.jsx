import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import './paragraph.style.scss';

const Paragraph = (props) => {
  const dateStarted = moment(props.dateStarted);
  const dateFinished = moment(props.dateFinished);

  return (
    <div className={props.className}>
      <div className={`${props.className}__header`}>
        <span className={`${props.className}__title`}>{props.title}</span>
        <FormattedMessage id={`paragraph.status.${props.status.toLowerCase()}`}>
          {txt => <span className={`${props.className}__status +${props.status.toLowerCase()}`}>{txt}</span>}
        </FormattedMessage>
      </div>
      {
        (dateFinished.isValid() && dateStarted.isValid())
          ? (
            <FormattedMessage
              id="paragraph.timestamp"
              values={{
                'eta': dateFinished.diff(dateStarted, 'seconds'),
                'date': props.dateUpdated,
              }}
            >
              {txt => <span className={`${props.className}__timestamp`}>{txt}</span>}
            </FormattedMessage>
          ) : (
            <FormattedMessage
              id="paragraph.noTimestamp"
              values={{
                'date': props.dateUpdated,
              }}
            >
              {txt => <span className={`${props.className}__timestamp`}>{txt}</span>}
            </FormattedMessage>
          )
      }
      {
        props.results.code === 'ERROR' && (
          <div className={`${props.className}__output`}>
            {
              props.results.msg.map(err =>
                err.data.split('\n').map((line, key) => <p key={key}>{line}</p>))
            }
          </div>
        )
      }
    </div>
  );
};
Paragraph.propTypes = {
  'className': PropTypes.string,
  'dateUpdated': PropTypes.string,
  'dateStarted': PropTypes.string,
  'dateFinished': PropTypes.string,
  'results': PropTypes.shape({
    'code': PropTypes.string,
    'msg': PropTypes.arrayOf(PropTypes.shape({
      'type': PropTypes.string,
      'data': PropTypes.string,
    })),
  }),
  'status': PropTypes.string,
  'title': PropTypes.string,
};
Paragraph.defaultProps = {
  'className': 'paragraph',
  'dateUpdated': '',
  'dateStarted': '',
  'dateFinished': '',
  'results': {
    'type': '',
    'msg': [],
  },
  'status': 'paragraph.status.unknown',
  'title': 'Untitled',
};

export default Paragraph;
