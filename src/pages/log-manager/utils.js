export const filterDataByMultipleTags = (data, tags) => {
  if (!tags.length) {
    return data;
  }
  return data.filter((item) => {
    let match = 0;
    tags.forEach((tag) => {
      if (item.source.toLowerCase().includes(tag.toLowerCase())) {
        match += 1;
      }
    });

    return match === tags.length;
  });
};
