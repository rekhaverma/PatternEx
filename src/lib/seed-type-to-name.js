export default (seedType = '') => {
  if (typeof seedType === 'string') {
    switch (seedType.toLowerCase()) {
      case 'suspicious':
        return 'Suspicious';
      case 'malicious':
        return 'Malicious';
      case 'label':
        return 'Label';
      case 'blocked':
        return 'Pattern generated';
      default:
        return seedType;
    }
  }
  return '';
};
