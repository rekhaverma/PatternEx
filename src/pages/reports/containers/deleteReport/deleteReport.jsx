import React from 'react';
import Modal from 'components/modal';
import PropTypes from 'prop-types';
import { Button } from 'components/forms';
import { FormattedMessage } from 'react-intl';
import './deleteReport.scss';

const DeleteReport = props => (
  <Modal>
    <section className="deleteReport">
      <div className="deleteReport__row +spaceBetween firstrow">
        <span className="deleteReport__title">
          <FormattedMessage
            id="reports.deleteReport.title"
            values={{
              'reportName': props.data.name,
            }}
          />
        </span>
        <span className="icon-close" onClick={props.onClose} />
      </div>
      <div className="deleteReport__row +spaceBetween">
        <FormattedMessage
          id="reports.deleteReport.confirmation"
          values={{
            'reportName': props.data.name,
          }}
        />
      </div>
      <div className="deleteReport__row +rightSide">
        <Button
          className="button--success +small"
          onClick={() => props.deleteReport(props.data.id)}
        >
          <FormattedMessage id="reports.delete" />
        </Button>
        <Button
          className="button--dark +small"
          onClick={props.onClose}
        >
          <FormattedMessage id="reports.cancel" />
        </Button>
      </div>
    </section>
  </Modal>
);

DeleteReport.propTypes = {
  'onClose': PropTypes.func.isRequired,
  'deleteReport': PropTypes.func.isRequired,
  'data': PropTypes.object.isRequired,
};

export default DeleteReport;
