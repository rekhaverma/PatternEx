import { createSelector } from 'reselect';
import { pipelineToName } from 'lib/decorators';

const rules = state => state.data.rules.toJS().rules;

/**
  * Function to format the rules mainly adding the label
  * and value to each item in the array
  *
  * @param {array}, rules
  * @return {array} updated rules
  */
export const formatRules = createSelector(
  rules,
  allRules =>
    allRules.reduce((acc, item) => {
      const values = item;
      delete values.href;
      return acc.concat([{
        ...values,
        'label': values.name,
        'value': values.id,
      }]);
    }, []),
);

// import moment from 'moment';


const allRules = state => state.allRules;
const inputValue = input => input.inputValue;
const pipelines = state => state.raw.toJS().pipelines;
const columnFormat = state => state.raw.toJS().columnFormat.items;

/**
 * Add pipelineV2 (Formated name of pipeline) properties
 *
 * @param {Array} allRules
 * @return {Array} Formatted rules
 */
// export const formatRulesData = createSelector(
//   allRules
//   (rule) => rule
//     && rules.reduce((acc, item) => acc.concat([{
//       ...item,
//       'pipelineV2': pipelineToName(item.pipeline),
//     }]), []),
// );


/**
 * Returns the array of active pipelines.
 *
 * @param {Object} pipelines
 * @return {Array}
*/
export const EnabledPipelines = createSelector(
  pipelines,
  pipeline => Object.keys(pipeline)
    .filter(key => pipeline[key].enabled)
    .map(item => ({
      'id': item,
      'content': pipelineToName(item) !== 'HPA' ? pipelineToName(item) : 'Login',
    })),
);

/**
 * Returns the array of columnFormat for selected pipeline.
 *
 * @param {Object} columnFormat items
 * @return {Array}
 */
export const formatColumnFormat = createSelector(
  columnFormat,
  column => column && column.map(item => ({
    'id': item.name,
    'content': item.displayName,
  })),
);

/**
 * Filter out the rules based on the searched text
 *
 * @param {Array} rules
 * @return {Array}
 */
export const filterRules = createSelector(
  allRules,
  inputValue,
  (rule, input) => rule.filter((el) => {
    const ruleFilter = `${el.name.toLowerCase()}
      ${pipelineToName(el.pipeline).toLowerCase()}
      ${el.update_time.toLowerCase()}`;
    return ruleFilter.includes(input.toLowerCase());
  }),
);
