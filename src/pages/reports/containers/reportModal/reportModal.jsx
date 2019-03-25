import React from 'react';
import Modal from 'components/modal';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { MaterialInput, Button } from 'components/forms';
import SelectBox from 'components/select-box';
import MultiSelect from 'components/multi-select';
import { nameToPipeline } from 'lib/decorators';
import './reportModal.scss';
import { modes } from '../../constants.jsx';

const filterRules = (rules, pipeline) => {
  if (!pipeline) {
    return [];
  }
  return rules.filter(rule => rule.pipeline === nameToPipeline(pipeline));
};

const ReportModal = props => (
  <Modal>
    <section className="newReport">
      <div className="newReport__row +spaceBetween newReport__firstrow">
        <span className="newReport__title">
          <FormattedMessage
            id="reports.reportModal.title"
            values={{
              'modalTitle': props.title,
            }}
          />
        </span>
        <span className="icon-close" onClick={props.onClose} />
      </div>
      <div className={`newReport__row +spaceBetween ${props.formErrors.name && '+error'}`}>
        { props.allowedFields.name &&
          (<MaterialInput
            inputOptions={{
              value: props.data.name,
              type: 'text',
              onChange: e => props.updateReportFields('name', e.target.value),
              id: 'reportName',
            }}
            label={props.formErrors.name || '*Name'}
          />
        )}
        { props.allowedFields.mode &&
          (
            <div className="newReport__mode">
              <SelectBox
                showLabel
                singleSelect
                activeOption={props.data.mode}
                options={modes}
                placeholder="Mode"
                onClick={value => props.updateReportFields('mode', value)}
              />
            </div>
          )
        }
      </div>
      { props.allowedFields.pipelines &&
        (
          <div className="newReport__row +spaceBetween">
            <div className="newReport__pipeline">
              <SelectBox
                showLabel
                singleSelect
                activeOption={props.data.pipeline}
                options={props.pipelines}
                placeholder="Select Pipeline"
                onClick={value => props.updateReportFields('pipeline', value)}
              />
            </div>
          </div>
        )
      }
      { props.allowedFields.rules &&
        (
          <div className={`newReport__row +spaceBetween ${props.formErrors.rules && '+error'}`}>
            <div className="newReport__rules">
              <MultiSelect
                options={filterRules(props.rules, props.data.pipeline)}
                value={props.data.rules}
                handleSelectChange={value => props.updateReportFields('rules', value)}
                placeholder={props.formErrors.rules || '*Select Rules'}
                type="customReportSpecific"
                onFooterClick={props.onAddnewRule}
              />
            </div>
          </div>
        )
      }
      <div className="newReport__row +rightSide">
        <Button
          className="button--success +small"
          onClick={props.saveDetail}
          disabled={!props.formValid}
        >
          <FormattedMessage
            id="reports.save"
          />
        </Button>
        <Button
          className="button--dark +small"
          onClick={props.onClose}
        >
          <FormattedMessage
            id="reports.cancel"
          />
        </Button>
      </div>
    </section>
  </Modal>
);

ReportModal.propTypes = {
  'onClose': PropTypes.func.isRequired,
  'pipelines': PropTypes.array.isRequired,
  'saveDetail': PropTypes.func.isRequired,
  'data': PropTypes.object.isRequired,
  'updateReportFields': PropTypes.func.isRequired,
  'rules': PropTypes.array.isRequired,
  'allowedFields': PropTypes.object.isRequired,
  'title': PropTypes.string.isRequired,
  'formErrors': PropTypes.object.isRequired,
  'formValid': PropTypes.bool.isRequired,
  'onAddnewRule': PropTypes.func.isRequired,
};

export default ReportModal;
