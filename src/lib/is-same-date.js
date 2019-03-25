export default (first, second) => (
  first.isSame(second, 'year')
  && first.isSame(second, 'month')
  && first.isSame(second, 'day')
);
