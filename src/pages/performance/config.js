import moment from 'moment';

export const getStartDateByClientName = (custormerName) => {
  switch (custormerName) {
    case 'newsaustralia':
      return {
        'defaultStart': moment('20171201'),
        'defaultEnd': moment().utc(),
      };
    default:
      return {
        'defaultStart': moment().utc().subtract(7, 'day'),
        'defaultEnd': moment().utc(),
      };
  }
};
