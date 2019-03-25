import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AdvanceSelect } from 'components/advance-select';
import { HeatMapDropdows } from 'model/classes/heat-map-dropdowns.class';

import { renderDropdownLabel } from '../../utils';

export class HeatMapDropdown extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mapping: {},
    };
  }

  componentDidMount() {
    const { data, row } = this.props;
    this.generateMapping(data, row);
  }

  componentWillReceiveProps({ data, row }) {
    this.generateMapping(data, row);
  }

  onFilterUpdate(tag, pipeline) {
    if (pipeline === 'all') {
      return this.props.resetFilters();
    }

    const propFilter = {};
    propFilter[pipeline] = tag;
    return this.props.setFilter('active', propFilter);
  }

  generateMapping(data, row) {
    const generator = new HeatMapDropdows(data, row);
    this.setState({
      mapping: generator.getDropdownsMap(),
    });
  }

  renderDropDowns() {
    const { mapping } = this.state;
    const { active } = this.props.filters;
    const pipelineFilter = Object.keys(active)[0];
    return Object.keys(this.state.mapping).map((tag, index) => {
      let activeOption = 'all';
      let tagTotal = 0;
      let options = Object.keys(mapping[tag].pipelines).map((pipeline, key) => {
        const pipelineTotal = mapping[tag].pipelines[pipeline];
        tagTotal += pipelineTotal;
        if (tag === active[pipelineFilter] && pipeline === pipelineFilter) {
          activeOption = pipeline;
        }
        return {
          id: pipeline,
          value: renderDropdownLabel(key, pipeline, pipelineTotal),
        };
      });
      options = [{ id: 'all', value: renderDropdownLabel(-1, 'All', tagTotal) }].concat(options);
      return (
        <div key={index} className="dhd__dropdown dhd-dropdown">
          <div className="dhd-dropdown__label">
            <FormattedMessage id={mapping[tag].i18n} />
          </div>
          <div className={`dhd-dropdown__select +${mapping[tag].class}`}>
            <AdvanceSelect
              dropDownHeader="Filter"
              allowClear
              defaultValue="all"
              activeOption={activeOption}
              options={options}
              onOptionUpdate={value => this.onFilterUpdate(tag, value)}
            />
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="dashbboard-heatmap-dropdowns dhd">
        <div className="dhd__labels">
          <FormattedMessage id="heatmap.title" />
          <FormattedMessage id="heatmap.subtitle" />
        </div>
        <div className="dhd__items">{this.renderDropDowns()}</div>
      </div>
    );
  }
}

HeatMapDropdown.propTypes = {
  data: PropTypes.array.isRequired,
  resetFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  row: PropTypes.array.isRequired,
  setFilter: PropTypes.func.isRequired,
};
