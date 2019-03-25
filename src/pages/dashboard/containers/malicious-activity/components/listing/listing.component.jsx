import React from 'react';
import PropTypes from 'prop-types';

import MultiSearch from 'components/multi-search';
import Table from 'components/table-v2';
import Loader from 'components/loader/loader-v2.component';
import { EvpOpenMethods } from 'model/classes/evp-open-methods';

import { maliciousColumns } from '../../constants';
import { filterByMultipleTags } from '../../utils';

export class Listing extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
    };
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(tags) {
    this.setState({ tags });
  }

  getFilteredData() {
    const {
      data,
      isOldEVPActive,
      handleExplodedView,
      setLabelForPrediction,
      deleteLabel,
    } = this.props;

    const filteredData = filterByMultipleTags(data, this.state.tags);

    return filteredData.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onRowClick': (e, row) => EvpOpenMethods.onRowClickHandler(row, 'malicious', isOldEVPActive, handleExplodedView),
        'onInspect': (e, row) => EvpOpenMethods.onInspectHandler(row, 'malicious', isOldEVPActive),
        'getNewTabUrl': row => EvpOpenMethods.getNewTabUrlHandler(row, 'malicious', isOldEVPActive),
        'onConfirm': (e) => {
          e.stopPropagation();
          const params = {
            ...el,
            start_time: el.end_time,
          };
          setLabelForPrediction(params, true);
        },
        'onDeny': (e) => {
          e.stopPropagation();
          setLabelForPrediction(el, false);
        },
        'deleteLabel': (e) => {
          e.stopPropagation();
          if (el.user_tag && el.user_tag.label_id) {
            deleteLabel(el.user_tag.label_id);
          }
        },
      },
    }));
  }

  render() {
    const {
      isDataLoaded,
      searchTags,
    } = this.props;

    if (!isDataLoaded) {
      return (
        <div className="dashboard__column">
          <Loader small />
        </div>
      );
    }

    const filteredData = this.getFilteredData();
    const tags = searchTags.concat(this.state.tags);

    return (
      <div className="dashboard__column full-width no-padding">
        <div className="dashboard__topColumn" style={{ display: 'flex' }}>
          <MultiSearch
            tags={tags}
            onChange={this.onSearchChange}
            placeholder="Search for entity or threat tactic"
          />
        </div>
        <Table
          classname="table"
          data={filteredData}
          tableConfig={maliciousColumns}
          pageSize="10"
        />
      </div>
    );
  }
}

Listing.propTypes = {
  isDataLoaded: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  handleExplodedView: PropTypes.func.isRequired,
  deleteLabel: PropTypes.func.isRequired,
  setLabelForPrediction: PropTypes.func.isRequired,
  isOldEVPActive: PropTypes.bool,
  searchTags: PropTypes.array,
};

Listing.defaultProps = {
  searchTags: [],
  isOldEVPActive: false,
};
