import React from 'react';
import PropTypes from 'prop-types';

import { mapIcons } from 'lib';
import { pipelineToName } from 'lib/decorators';

import { Scrollbars } from 'react-custom-scrollbars';
import Table from 'components/table';

import EntityItem from './entity-item.component';
import { Search } from '../../../components/search';

import '../suspicious-entities.style.scss';

const filterData = (data, label) => data.filter(el => el.entity_name.toLowerCase()
  .includes(label.toLowerCase()));

class EntityList extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'inputValue': '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.resetInput = this.resetInput.bind(this);
  }

  handleChange(e) {
    this.setState({
      'inputValue': e.target.value,
    });
  }

  resetInput() {
    this.setState({
      'inputValue': '',
    });
  }

  render() {
    const {
      className,
      items,
      onClick,
      selectedPipeline,
    } = this.props;
    const { inputValue } = this.state;
    const tableColumns = [
      {
        'className': 'table__headerColumn',
        'isKey': false,
        'field': 'create_time',
        'hidden': false,
        'label': 'Date',
      },
      {
        'className': 'table__headerColumn--entity',
        'isKey': true,
        'field': 'entity_name',
        'hidden': false,
        'label': 'Entity',
        'dataFormat': (cell, row) => (
          <span className="table__cell" onClick={e => row.handlers.onInspect(e, row)}>
            <span className={mapIcons(row.entity_type)} />
            {cell}
          </span>
        ),
      },
      {
        'className': 'table__headerColumn--highlighted',
        'isKey': false,
        'field': 'source',
        'hidden': false,
        'label': 'Log Source',
      },
    ];

    return (
      <section className={className} onClick={this.resetInput}>
        {
          Object.keys(items).map((pipeline, index) => (
            <EntityItem
              key={index}
              icon={pipeline}
              amount={items[pipeline].length}
              label={pipelineToName(pipeline)}
              content={(
                <div>
                  <Search
                    customClassName="search__suspiciousList"
                    placeholder="Search for entity or log source"
                    value={inputValue}
                    onChange={this.handleChange}
                  />
                  <Scrollbars
                    autoHeight
                    autoHeightMax={200}
                    renderThumbVertical={subProps => <div {...subProps} style={{ 'backgroundColor': '#1b1b1b', 'borderRadius': '3px' }} className="thumb-vertical" />}
                  >
                    <Table
                      className="table"
                      columns={tableColumns}
                      data={inputValue === '' ? items[pipeline] : filterData(items[pipeline], inputValue)}
                      options={{}}
                      expandableRow={() => null}
                      expandComponent={() => null}
                    />
                  </Scrollbars>
                </div>
              )}
              onClick={onClick}
              active={selectedPipeline === pipeline}
            />
          ))
        }
      </section>
    );
  }
}

EntityList.displayName = 'EntityList';
EntityList.propTypes = {
  'className': PropTypes.string,
  'items': PropTypes.object,
  'onClick': PropTypes.func,
  'selectedPipeline': PropTypes.string,
};
EntityList.defaultProps = {
  'className': 'entity__list',
  'items': {},
  'onClick': () => null,
  'selectedPipeline': '',
};

export default EntityList;
