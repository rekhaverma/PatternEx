export default (arr, element) => {
  const indexOfElement = arr.indexOf(element);

  if (indexOfElement === -1) {
    return arr;
  }

  if (indexOfElement === 0) {
    return arr.slice(1);
  }

  if (indexOfElement === arr.length) {
    return arr.slice(indexOfElement);
  }

  return [].concat(
    arr.slice(0, indexOfElement),
    arr.slice(indexOfElement + 1),
  );
};
