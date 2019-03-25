/**
 * @todo: refactor this
 * @param data
 * @returns {*}
 */
export default (data) => {
  const splitByNewLine = data.split('\n');
  const extractPropertiesName = splitByNewLine[0].split('\t');
  splitByNewLine.shift();
  const createRowObject = extractPropertiesName.reduce((acc, value, i) => ([
    ...acc,
    {
      'idx': i,
      'name': value,
    },
  ]), []);

  function mapPropertiesWithFields(rowData) {
    return rowData.reduce((acc, value, i) => ({
      ...acc,
      [createRowObject[i].name]: value,
    }), {});
  }

  function isHTML(str) {
    const a = document.createElement('div');
    a.innerHTML = str;
    /* eslint-disable */
    for (let c = a.childNodes, i = c.length; i--;) {
      if (c[i].nodeType === 1) return true;
    }
    /* eslint-enable */

    return false;
  }

  return splitByNewLine.reduce((acc, value) => {
    if (value !== '' && !isHTML(value) && !value.includes('<!--')) {
      return [
        ...acc,
        {
          ...mapPropertiesWithFields(value.split('\t')),
        },
      ];
    }
    return [...acc];
  }, []);
};
