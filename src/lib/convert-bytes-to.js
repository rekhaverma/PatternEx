import { numberPretty } from './index';

const convertToGb = bytes => numberPretty(+(bytes / (1024 ** 3)).toFixed(1));
const convertToMb = bytes => numberPretty(+(bytes / (1024 ** 2)).toFixed(1));
const convertToKb = bytes => numberPretty(+(bytes / 1024).toFixed(1));

const convertToFormat = (bytes, format) => {
  switch (format.toUpperCase()) {
    case 'GB':
      return `${convertToGb(bytes)} GB`;
    case 'MB':
      return `${convertToMb(bytes)} MB`;
    case 'KB':
      return `${convertToKb(bytes)} KB`;
    default:
      return bytes;
  }
};

const convertRecommendedFormat = (bytes) => {
  const gbs = convertToGb(bytes);
  if (+gbs > 0.5) {
    return `${gbs} GB`;
  }

  const mbs = convertToMb(bytes);
  if (+mbs > 0.5) {
    return `${mbs} MB`;
  }

  return `${convertToKb(bytes)} KB`;
};

export default (bytes, format = 'gb', force = false) => {
  if (!bytes) {
    return `0 ${format.toUpperCase()}`;
  }

  if (force) {
    return convertToFormat(bytes, format);
  }

  return convertRecommendedFormat(bytes);
};
