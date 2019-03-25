import React from 'react';

import { filterByMultipleTags, renderDropdownLabel } from './utils';

describe('utils', () => {
  describe('filterByMultipleTags', () => {
    it('should return the data filtered by multiple tags', () => {
      const data = [
        {
          entity_name: 'string 1',
          threat: 'string 2',
        },
        {
          entity_name: 'string 3',
          threat: 'string 1',
        },
        {
          entity_name: 'string 2',
          threat: 'string 2',
        }];

      const tags = ['string 1', 'string 2'];

      expect(filterByMultipleTags(data, tags).length).toBe(1);
    });
  });

  describe('renderDropdownLabel', () => {
    it('should match with snapshot', () => {
      expect(renderDropdownLabel(1, 'dstip', 1)).toMatchSnapshot();
    });
  });
});