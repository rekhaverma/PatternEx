# Style Guide

## Commit Messages

1. Commit title should include the issue number (limit it to 50 characters)
1. Commit body should explain each change of commit

Commit template e.g.

```text
[BYUI-XXX] Title

  * commit message

Ticket: [BYUI-XXX]
Signed-off-by: Name & email
```

## JavaScript Styleguide

We extend Airbnb eslint preset. Please check .eslintrc while we document this as well.

## Documentation Styleguide

- Use [JSDoc](http://usejsdoc.org/).
- Document each function or method and also feel free to document between lines if the logic is not that simple.

### Example

```javascript
  /**
   * Create an array of URLs for each date between 'fromDate' and 'untilDate'.
   *
   * Both dates are Moment instances. So, to find the range from 'startDate' to
   * 'untilDate', we will loop while 'startDate' is a date before 'untilDate'
   * (using Moment's method isBefore()) and add another 24 hours to 'startDate'.
   *
   * E.g.
   *  timeline: { 'fromDate': 2017-07-02, 'untilDate': 2017-07-04 }
   *  requests: ['cluster_entities/2017-09-26', 'cluster_entities/2017-09-27']
   *
   * @param {Object} timeline   Object containg 'fromDate' and 'untilDate'
   * @return {Array}
   */
   const createTimelineRangeUrls = ({ fromDate, untilDate }) => {}
```
