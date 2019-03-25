import { isEqual } from 'lodash';

export default (first = [], second = []) => isEqual(first, second);
