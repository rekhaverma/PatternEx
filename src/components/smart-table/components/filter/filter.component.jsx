import React from 'react';
import PropTypes from 'prop-types';

import MultiSearch from 'components/multi-search/multi-search.component';
import { OptionsToggle } from 'components/options-toggle';

export const Filter = (props) => {
  const {
    className,
    hasMultiTagSearch,
    onMultiTagsSearchChange,
    tags,
    placeholder,
    tableConfig,
    updateTableConfig,
  } = props;

  const getOptions = () => tableConfig.filter(item => !item.alwaysVisible)
    .map(item => ({
      id: item.field,
      label: item.label,
      isSelected: !item.hidden,
    }));

  const rootClassName = `${className}__filter`;
  return (
    <div className={rootClassName}>
      {
        hasMultiTagSearch && (
          <MultiSearch
            onChange={onMultiTagsSearchChange}
            tags={tags}
            placeholder={placeholder}
          />
        )
      }
      <OptionsToggle
        options={getOptions()}
        onOptionsUpdate={updateTableConfig}
      />
    </div>
  );
};

Filter.propTypes = {
  tableConfig: PropTypes.array.isRequired,
  updateTableConfig: PropTypes.func.isRequired,
  hasMultiTagSearch: PropTypes.bool,
  onMultiTagsSearchChange: PropTypes.func,
  tags: PropTypes.array,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

Filter.defaultProps = {
  hasMultiTagSearch: false,
  onMultiTagsSearchChange: () => null,
  tags: [],
  placeholder: 'Search...',
  className: 'smart-table',
};
