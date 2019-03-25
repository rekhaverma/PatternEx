import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { pipelineToName } from 'lib/decorators';
import { seedTypeToName } from 'lib';
import HeatMapModel from 'model/classes/heat-map.class';
import Tooltip from 'components/tooltip';

import { connect } from 'react-redux';

import HeatMap, { HeatMapCell, HeatMapCellIcon } from '../../components/heat-map-2';

class HeatMapContainer extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'highlighted': {},
      'model': new HeatMapModel([], [], {}),
    };
    this.generateColumns = this.generateColumns.bind(this);
    this.setActive = this.setActive.bind(this);
  }

  componentDidMount() {
    const { row, tags, data, rowType } = this.props;
    if (moment.isMoment(this.props.filters.highlighted)) {
      this.setState({
        'model': new HeatMapModel(data, row, tags, rowType),
        'highlighted': HeatMapModel.findHighlighted(
          data,
          this.props.filters.highlighted,
        ),
      });
    } else {
      this.setState({
        'model': new HeatMapModel(data, row, tags, rowType),
        'highlighted': {},
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { row, tags, data, rowType } = nextProps;
    if (moment.isMoment(nextProps.filters.highlighted)) {
      this.setState({
        'model': new HeatMapModel(data, row, tags, rowType),
        'highlighted': HeatMapModel.findHighlighted(
          data,
          nextProps.filters.highlighted,
        ),
      });
    } else {
      this.setState({
        'model': new HeatMapModel(data, row, tags, rowType),
        'highlighted': {},
      });
    }
  }

  setActive(active) {
    this.props.setFilter(active);
  }

  generateColumns() {
    const data = this.state.model.constructDefaultData();
    const { rowType } = this.props;
    if (data.size > 0) {
      const item = rowType === 'pipeline' ? data.get('sip') : data.get('suspicious');
      return Array.from(item.keys()).map((key, index) => {
        if (key === 'id') {
          return {
            'className': 'heatMap__td--icon',
            'isKey': true,
            'field': 'id',
            'hidden': false,
            'label': '',
            'width': '120',
            'dataFormat': cell => (
              <Tooltip
                trigger={(
                  <HeatMapCellIcon id={cell} isText rowType={rowType} />
                )}
                position="bottom"
                key={index}
              >
                {rowType === 'pipeline' ? pipelineToName(cell) : seedTypeToName(cell)}
              </Tooltip>
            ),
          };
        }

        return {
          'className': 'heatMap__td',
          'isKey': false,
          'field': key,
          'hidden': false,
          'label': this.state.model.formatTagName(key),
          'dataFormat': (cell, row) => (<HeatMapCell
            active={this.props.filters.active}
            activeSeverity={this.props.filters.filterBySeverity}
            cell={cell}
            field={key}
            highlighted={this.state.highlighted}
            opacity={HeatMapModel
              .calculateOpacity(cell.length, this.state.model.columnMaxCount[key])}
            row={row}
            severity={HeatMapModel.calculateSeverity(cell.length, index)}
            onClick={cell.length > 0
              ? () => { this.setActive({ [row.id]: key }); }
              : () => null}
          />),
        };
      });
    }

    return [];
  }

  render() {
    const columns = this.generateColumns();
    const data = this.state.model.data;
    if (columns.length > 0) {
      return (
        <div>
          <HeatMap
            columns={columns}
            data={data}
            options={{}}
          />
        </div>
      );
    }

    return (<div />);
  }
}
HeatMapContainer.propTypes = {
  'data': PropTypes.array.isRequired,
  'filters': PropTypes.object.isRequired,
  'row': PropTypes.array.isRequired,
  'tags': PropTypes.object.isRequired,
  'setFilter': PropTypes.func.isRequired,
  'rowType': PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  'tags': state.raw.toJS().tags,
});

export default connect(mapStateToProps, null)(HeatMapContainer);
