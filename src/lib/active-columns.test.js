import activeColumns from './active-columns';

describe('Active Table Columns', () => {
  beforeEach(() => {
    global.localStorage = jest.fn();
    global.localStorage.setItem = jest.fn();
    global.localStorage.getItem = jest.fn();
  });

  it('should set in local storage active columns', () => {
    activeColumns.setActiveOptions('test_table', ['col_one', 'col_two']);

    expect(JSON.parse(global.localStorage.setItem.mock.calls[0][1]).test_table).toEqual(['col_one', 'col_two']);
  });

  it('should return active columns from local storage', () => {
    global.localStorage.getItem = () => JSON.stringify({ 'test_table': ['col_one', 'col_two'] });

    expect(activeColumns.getActiveOptions('test_table')).toEqual(['col_one', 'col_two']);
  });
});
