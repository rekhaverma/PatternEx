import { capitalizeFirstLetter } from './index';

export default (string) => {
  if (!string) {
    return string;
  }
  return string.toString().split('_')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
};
