import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { EvpOpenMethods } from 'model/classes/evp-open-methods';
import { pipelineToName } from 'lib/decorators';
import Search from 'components/search';
import AdvancedTable from 'components/advanced-table';
import { MALICIOUS_TABLE } from 'config';

import { maliciousConfig } from './config';

const extractRelatedEntities = (entities, tags) => entities
  .reduce((acc, item) => {
    const splitEntityArr = item.entity_name.split(/[\n\t ]+/);
    const returnVal = {
      ...item,
      'tactic': tags[item.tag_id] && tags[item.tag_id].name,
      'predicted_tag_detail': tags[item.tag_id],
      'sip': '',
      'dip': '',
      'domain': '',
      'uid': '',
      'expanded': [],
      'type': pipelineToName(item.pipeline),
      'create_time': moment.utc(item.create_time).format('MM-DD-YYYY'),
      'start_time': moment.utc(item.start_time).format('MM-DD-YYYY'),
      'start_time_moment': moment.utc(item.start_time),
      'end_time_moment': moment.utc(item.end_time),
    };

    if (Object.keys(item).includes('related_entities') && item.related_entities) {
      if (item.related_entities.length > 1) {
        returnVal.related_entities = `Many (${item.related_entities.length})`;
      } else {
        returnVal.related_entities = item.related_entities[0];
      }
    }

    if (item.map_users) {
      if (typeof item.map_users === 'string') {
        returnVal.user = item.map_users.toString().trim() === '-' ? '' : item.map_users;
      } else {
        const usersArr = Object.keys(item.map_users);
        if (usersArr.length <= 1) {
          returnVal.user = usersArr.join(', ');
        } else {
          returnVal.user = `Many (${usersArr.length})`;
        }
      }
    }

    switch (item.pipeline) {
      case 'sip':
        returnVal.sip = item.entity_name;
        break;
      case 'sipdip':
        returnVal.sip = splitEntityArr[0] || '';
        returnVal.dip = splitEntityArr[1] || '';
        break;
      case 'dip':
        returnVal.dip = item.entity_name;
        break;
      case 'hpa':
        returnVal.sip = item.entity_name;
        break;
      case 'user':
        returnVal.user = item.entity_name;
        break;
      case 'useraccess':
        returnVal.user = item.entity_name;
        break;
      case 'domain':
        returnVal.domain = item.entity_name;
        break;
      case 'sipdomain':
        returnVal.sip = splitEntityArr[0] || '';
        returnVal.domain = splitEntityArr[1] ? splitEntityArr[1] : '';
        break;
      case 'request':
        returnVal.sip = item.entity_name.split(' ')[0];
        returnVal.uid = item.entity_name.split(' ')[1];
        break;
      default:
        break;
    }

    if (Array.isArray(item.related_entities)) {
      returnVal.expanded = returnVal.expanded.concat(item.related_entities.map((el) => {
        const relatedElementValues = el.split(',');
        return {
          'sip': relatedElementValues[0],
          'dip': relatedElementValues[1],
          'domain': relatedElementValues[2],
          'map_users': relatedElementValues[3],
          'parentId': item.id,
        };
      }));
    }

    return acc.concat([returnVal]);
  }, []);

const filterBySearch = (entities, valueSearched) => entities.filter((el) => {
  if (el.entity_name.toLowerCase().includes(valueSearched.toLowerCase())
  || el.type.toLowerCase().includes(valueSearched.toLowerCase())
  || el.tactic.toLowerCase().includes(valueSearched.toLowerCase())
  || el.domain.toLowerCase().includes(valueSearched.toLowerCase())
  || el.sip.includes(valueSearched) || el.dip.includes(valueSearched)) {
    return el;
  }

  /*
    If valueSearch contains multiple words, then search for the following
    combinations: sip && dip, dip && sip, sip && domain,
    domain && sip, dip && domain, domain && dip
  */
  if (valueSearched && valueSearched !== '' && valueSearched.split(' ').length > 1) {
    const val = valueSearched.split(' ');
    if ((el.sip.includes(val[0]) && el.dip.includes(val[1]))
      || (el.sip.includes(val[1]) && el.dip.includes(val[0]))
      || (el.sip.includes(val[0]) && el.domain.toLowerCase().includes(val[1].toLowerCase()))
      || (el.domain.toLowerCase().includes(val[0].toLowerCase()) && el.sip.includes(val[1]))
      || (el.dip.includes(val[0]) && el.domain.toLowerCase().includes(val[1].toLowerCase()))
      || (el.domain.toLowerCase().includes(val[0].toLowerCase()) && el.dip.includes(val[1]))) {
      return el;
    }
  }
  return null;
});

// const isExpandableRowCb = row => Object.keys(row.expanded).length > 0;
// const expandComponentCb = row => (
//   <div>
//     {
//       row.expanded.map((el, index) => (
//         <div key={`${row.id}-list-${index}`} className="listingTable__expandedWrap">
//           <span className="listingTable__expandedRow">{el.sip}</span>
//           <span className="listingTable__expandedRow">{el.dip}</span>
//           <span className="listingTable__expandedRow">{el.domain}</span>
//         </div>
//       ))
//     }
//   </div>
// );

const expandColumnComponent = ({ isExpandableRow, isExpanded }) => {
  if (isExpandableRow) {
    if (isExpanded) {
      return <span className="icon-minus-square-o" />;
    }
    return <span className="icon-plus-square-o" />;
  }
  return <span />;
};
expandColumnComponent.propTypes = {
  'isExpandableRow': PropTypes.bool.isRequired,
  'isExpanded': PropTypes.bool.isRequired,
};

// const getCaret = (direction) => {
//   switch (direction) {
//     case 'asc':
//       return (<span className="icon-sort-asc" />);
//     case 'desc':
//       return (<span className="icon-sort-desc" />);
//     default:
//       return (<span className="icon-sort" />);
//   }
// };

class ListingTable extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'recordsSearch': '',
      'filteredData': [],
      'data': [],
    };

    this.handleRecordsSearch = this.handleRecordsSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const parsed = extractRelatedEntities(nextProps.items, nextProps.tags);

    this.setState({
      'data': parsed,
      'filteredData': parsed,
    });
  }

  handleRecordsSearch(value) {
    this.setState({
      'recordsSearch': value,
    }, () => {
      const { data } = this.state;
      this.setState({
        'filteredData': filterBySearch(data, value),
      });
    });
  }

  render() {
    const { className, isOldEVPActive, handleExplodedView } = this.props;
    let { filteredData } = this.state;

    filteredData = filteredData.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onRowClick': (e, row) => EvpOpenMethods.onRowClickHandler(row, 'malicious', isOldEVPActive, handleExplodedView),
        'onInspect': (e, row) => EvpOpenMethods.onInspectHandler(row, 'malicious', isOldEVPActive),
        'getNewTabUrl': row => EvpOpenMethods.getNewTabUrlHandler(row, 'malicious', isOldEVPActive),
      },
    }));

    return (
      <div className={className}>
        <AdvancedTable
          data={filterBySearch(filteredData, this.state.recordsSearch)}
          tableConfig={maliciousConfig}
          locationPage={MALICIOUS_TABLE}
        >
          <div className={`${className}__settings`}>
            <div className={`${className}__settings__side +right`}>
              <Search
                inputProps={{
                'placeholder': 'Search by entity or records ...',
                'value': this.state.recordsSearch,
                'onChange': e => this.handleRecordsSearch(e.target.value),
              }}
              />
            </div>
          </div>
        </AdvancedTable>
      </div>
    );
  }
}
ListingTable.displayName = 'ListingTable';
ListingTable.propTypes = {
  'className': PropTypes.string,
  'items': PropTypes.array,
  'tags': PropTypes.object,
  'handleExplodedView': PropTypes.func,
  'isOldEVPActive': PropTypes.bool,
};
ListingTable.defaultProps = {
  'backRoute': null,
  'className': 'listingTable',
  'items': [],
  'tags': {},
  'handleExplodedView': () => null,
  'isOldEVPActive': false,
};

export default ListingTable;
