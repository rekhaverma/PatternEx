import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import pipelineToName from 'lib/decorators/pipeline-to-name';
import { formatStatus, formatMode } from './../../lib/format-actions';

import './modelDetail.style.scss';

const ModelDetails = (props) => {
  const { modelDetails, columnFormat, row } = props;
  return (
    <div className="modelDetailTable">
      <div className="modelDetailTable__row">
        <div className="model-detail-heading">
          <span className="big-heading">
            <FormattedMessage
              id="model.details.heading"
              values={{
                'name': modelDetails.name || 'NA',
              }}
            />
          </span>
          <span className="icon-close" onClick={props.onCancel} />
        </div>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr height="30">
              <td colSpan="2" />
            </tr>
            <tr>
              <td>Model alias</td>
              <td>{row.model_alias_formatted || 'NA'}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{formatStatus(null, row)}</td>
            </tr>
            <tr>
              <td>Model type</td>
              <td>
                <FormattedMessage
                  id="model.details.type"
                  values={{
                    'type': modelDetails.model_type === 'Ranking' ? 'Outlier' : (modelDetails.model_type || 'NA'),
                    'featureType': pipelineToName(modelDetails.feature_type || 'NA'),
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Mode</td>
              <td>{formatMode('', modelDetails) || 'NA'}</td>
            </tr>
            <tr>
              <td>Deployed on</td>
              <td>
                <FormattedMessage
                  id="model.details.depTS"
                  values={{
                    'depTS': modelDetails.dep_ts || 'NA',
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Training dates</td>
              <td>
                <FormattedMessage
                  id="model.details.batchDate"
                  values={{
                    'batchDate': modelDetails.batch_date || 'NA',
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Algorithm</td>
              <td>
                <span>
                  <FormattedMessage
                    id="model.details.algo.strategy"
                    values={{
                      'strategy': (modelDetails.algorithm && modelDetails.algorithm.strategy) || 'NA',
                    }}
                  />
                </span><br />
                <span>
                  <FormattedMessage
                    id="model.details.algo.name"
                    values={{
                      'name': (modelDetails.algorithm && modelDetails.algorithm.name) || 'NA',
                    }}
                  />
                </span><br />
                <span>
                  <FormattedMessage
                    id="model.details.algo.fineSet"
                    values={{
                      'fineSet': (modelDetails.algorithm && modelDetails.algorithm.fine_tuning_set) || 'NA',
                    }}
                  />
                </span>
              </td>
            </tr>
            {
              modelDetails.is_user_model && (
                <tr>
                  <td>Selected features</td>
                  <td>
                    {modelDetails && columnFormat && modelDetails.features
                      && modelDetails.features.length
                      && modelDetails.features.reduce((cur, next, index) => (
                        index ? (`${cur}, ${columnFormat[next]}`) : columnFormat[next]
                      ), '')}
                  </td>
                </tr>
               )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

ModelDetails.propTypes = {
  'modelDetails': PropTypes.object.isRequired,
  'columnFormat': PropTypes.object.isRequired,
  'row': PropTypes.object.isRequired,
  'onCancel': PropTypes.func.isRequired,
};

export default ModelDetails;
