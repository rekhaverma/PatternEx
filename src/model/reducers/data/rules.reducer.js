import { fromJS } from 'immutable';
import * as actions from 'model/actions';

const initialState = fromJS({
  'isLoading': [],
  'rules': [],
  'ruleDetail': {},
  'ruleAction': '',
  'ruleError': '',
});

export default (state = initialState, { type, payload }) => {
  const isLoading = state.get('isLoading');
  switch (type) {
    case actions.GET_RULES:
    case actions.ADD_RULE:
    case actions.UPDATE_RULE:
      return state
        .set('isLoading', isLoading.push(type));

    case actions.GET_RULES_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.GET_RULES))
        .set('rules', fromJS(payload));

    case actions.GET_RULES_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.GET_RULES));

    case actions.ADD_RULE_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.ADD_RULE))
        .set('ruleAction', 'Success');

    case actions.ADD_RULE_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.ADD_RULE))
        .set('ruleAction', 'Failed')
        .set('ruleError', payload);

    case actions.UPDATE_RULE_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.UPDATE_RULE))
        .set('ruleAction', 'Success');

    case actions.UPDATE_RULE_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.UPDATE_RULE))
        .set('ruleAction', 'Failed')
        .set('ruleError', payload);

    case actions.RESET_RULES_STATE:
      return state.set('ruleAction', '');

    case actions.RESET_RULES_ERROR_STATE:
      return state.set('ruleError', '');

    case actions.GET_RULE_DETAIL:
      return state.set('isLoading', isLoading.push(type))
        .set('ruleDetail', fromJS({}));

    case actions.GET_RULE_DETAIL_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.GET_RULE_DETAIL))
        .set('ruleDetail', fromJS(payload));

    case actions.GET_RULE_DETAIL_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.GET_RULE_DETAIL))
        .set('ruleDetail', fromJS({}));

    case actions.DELETE_RULE:
      return state.set('isLoading', isLoading.push(type));

    case actions.DELETE_RULE_SUCCESS:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.DELETE_RULE))
        .set('ruleAction', 'Success');

    case actions.DELETE_RULE_FAILED:
      return state.set('isLoading', isLoading.filterNot(action => action === actions.DELETE_RULE))
        .set('ruleAction', 'Failed');

    default:
      return state;
  }
};
