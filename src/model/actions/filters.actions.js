export const SET_FILTER = '@@filters/SET_FILTER';
export const CLEAR_FILTERS = '@@filters/CLEAR_FILTERS';
export const SET_ENTITY = '@@filters/SET_ENTITY';

/**
 * Action to set a filter. Action will modify the "filters" state.
 * e.g. of filters: threat_tactic, behavior, query
 *
 * @param {String} filter
 * @param {String} value
 * @return {Object}
 */
export const setFilter = (filter, value) => ({ 'type': SET_FILTER, 'payload': { filter, value } });

export const selectEntity = name => ({ 'type': SET_ENTITY, 'payload': name });

export const clearFilters = () => ({ 'type': CLEAR_FILTERS });
