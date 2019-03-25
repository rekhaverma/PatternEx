import React from 'react';
import Modal from 'components/modal';
import PropTypes from 'prop-types';
import { Button } from 'components/forms';
import { FormattedMessage } from 'react-intl';
import { pipelineToName } from 'lib/decorators';
import './viewDetail.scss';

const ViewDetail = props => (
  <Modal>
    <section className="viewDetail">
      <div className="viewDetail__row +spaceBetween firstrow">
        <span className="viewDetail__title">
          <b>
            <FormattedMessage
              id="reports.viewDetail.title"
            />
          </b>
        </span>
        <span className="icon-close" onClick={props.onClose} />
      </div>
      <div className="viewDetail__row +spaceBetween">
        <FormattedMessage
          id="reports.viewDetail.pipeline"
          values={{
            'pipeline': pipelineToName(props.data.pipeline && props.data.pipeline.split('_')[0]),
          }}
        />
      </div>
      <div className="viewDetail__row +spaceBetween">
        <b>
          <FormattedMessage
            id="reports.viewDetail.mode"
            values={{
              'mode': props.data.pipeline && props.data.pipeline.includes('_byday') ? 'Batch' : 'Real-time',
            }}
          />
        </b>
      </div>
      <div className="viewDetail__row +spaceBetween">
        <b>
          <FormattedMessage
            id="reports.viewDetail.rulesCaption"
          /> -
        </b>
      </div>
      { props.rules
        .map((rule, index) =>
          (
            <div key={index} className="viewDetail__row +spaceBetween">
              {rule.name}
            </div>
          ))
      }
      <div className="viewDetail__row +rightSide">
        <Button
          className="button--dark +small"
          onClick={props.onClose}
        >
          <FormattedMessage id="reports.close" />
        </Button>
      </div>
    </section>
  </Modal>
);

ViewDetail.propTypes = {
  'onClose': PropTypes.func.isRequired,
  'data': PropTypes.object.isRequired,
  'rules': PropTypes.array.isRequired,
};

export default ViewDetail;
