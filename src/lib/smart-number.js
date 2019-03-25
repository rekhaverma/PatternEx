import { numberPretty } from 'lib';

const formatNumber = (number, pow) => (number / (10 ** pow)).toFixed(1);

export default (number) => {
  if (number < 10 ** 3) {
    return numberPretty(number);
  }

  if (number < 10 ** 6) {
    return `${formatNumber(number, 3)} K`;
  }

  if (number < 10 ** 9) {
    return `${formatNumber(number, 6)} M`;
  }

  return `${formatNumber(number, 9)} B`;
};
