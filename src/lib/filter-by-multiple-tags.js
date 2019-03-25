const isKeySearchable = value => typeof value === 'string';
export default (data, tags) => {
  if (!tags.length) {
    return data;
  }

  return data.filter((item) => {
    let match = 0;
    tags.forEach((tag) => {
      const keys = Object.keys(item).filter(key => isKeySearchable(item[key]));
      const hasResult = keys.find((key) => {
        if (!item[key]) {
          return false;
        }

        return item[key].toString().toLowerCase().includes(tag.toLowerCase());
      });

      if (hasResult) {
        match += 1;
      }
    });

    return match === tags.length;
  });
};
