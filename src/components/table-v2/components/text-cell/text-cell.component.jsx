import React from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'fixed-data-table-2';
import { FormattedMessage } from 'react-intl';

import { mapIcons, slugify } from 'lib';
import { pipelineToName } from 'lib/decorators';
import { tagsI18nMapping } from 'model/classes/heat-map-dropdowns.class';

import { Button } from 'components/forms';
import Tooltip from 'components/tooltip';
import { Tag } from 'components/tag';
import { Toggle } from '../../../toggle';

class TextCell extends React.PureComponent {
  render() {
    const { data, rowIndex, columnKey, ...props } = this.props;

    const renderActions = (rowData) => {
      const renderInspectAction = Object.keys(rowData.handlers).includes('onInspect');
      const renderConfirmAction = Object.keys(rowData.handlers).includes('onConfirm');
      const labelId = rowData.user_tag ? rowData.user_tag.label_id : null;
      const labelName = rowData.user_tag ? rowData.user_tag.name : null;
      let newTabUrl = false;
      if (renderInspectAction) {
        newTabUrl = rowData.handlers.getNewTabUrl(rowData);
      }
      return (
        <span className="table__cell--actions">
          {
            renderInspectAction && (
              <Tooltip
                position="bottom"
                trigger={newTabUrl ? (
                  <a href={newTabUrl} target="_blank" rel="noopener noreferrer">
                    <span className="icon-tab" />
                  </a>
                ) : (
                  <span
                    className="icon-tab"
                    onClick={e => rowData.handlers.onInspect(e, rowData)}
                  />
                )}
              >
                <FormattedMessage id="tooltip.openNewTab" />
              </Tooltip>
            )
          }
          {
            !labelId && renderConfirmAction && (
              <Button
                className="button--success +small +tableButton"
                onClick={e => rowData.handlers.onConfirm(e, rowData)}
              >
                Set Label
              </Button>
            )
          }
          {
            labelName && (
              <Tag
                label={labelName}
                onRemove={e => rowData.handlers.deleteLabel(e, rowData)}
              />
            )
          }
        </span>
      );
    };

    const renderDataSourceActions = (rowData) => {
      const renderViewAction = Object.keys(rowData.handlers).includes('onViewDetails');
      const renderStartAction = Object.keys(rowData.handlers).includes('onStart') &&
        rowData.status !== 'running';
      const renderStopAction = Object.keys(rowData.handlers).includes('onStop') &&
        rowData.status === 'running';
      const renderDeleteAction = Object.keys(rowData.handlers).includes('onDelete');

      let className = 'table__cell--actions table__cell--data-source-actions';
      if (rowData.processingLoading) {
        className += ' table__cell--disabled';
      }
      return (
        <span className={className}>
          {
            renderViewAction && (
              <Tooltip
                position="bottom"
                trigger={(
                  <span
                    className="icon-information"
                    onClick={e => rowData.handlers.onViewDetails(e, rowData)}
                  />
                )}
              >
                <FormattedMessage id="tooltip.details" />
              </Tooltip>
            )
          }
          {
            renderStartAction && (
              <Tooltip
                position="bottom"
                trigger={(
                  <span
                    className="icon-add"
                    onClick={e => rowData.handlers.onStart(e, rowData)}
                  />
                )}
              >
                <FormattedMessage id="tooltip.enable" />
              </Tooltip>
            )
          }
          {
            renderStopAction && (
              <Tooltip
                position="bottom"
                trigger={(
                  <span
                    className="icon-remove"
                    onClick={e => rowData.handlers.onStop(e, rowData)}
                  />
                )}
              >
                <FormattedMessage id="tooltip.disable" />
              </Tooltip>
            )
          }
          {
            renderDeleteAction && (
              <Tooltip
                position="bottom"
                trigger={(
                  <span
                    className="icon-trash-outline"
                    onClick={e => rowData.handlers.onDelete(e, rowData)}
                  />
                )}
              >
                <FormattedMessage id="tooltip.delete" />
              </Tooltip>
            )
          }
        </span>
      );
    };

    const renderIconEntity = (rowData) => {
      const hasOnClickHandler = Object.keys(rowData).includes('handlers')
        && Object.keys(rowData.handlers).includes('onRowClick');

      return (
        <div className="custom-cell__icon-entity" key={rowData.entity_name}>
          {/*
            add the icon with the descriptive tooltip
          */}
          <Tooltip
            position="bottom"
            trigger={(
              <span className={mapIcons(rowData.entity_type)} />
            )}
          >
            {pipelineToName(rowData.entity_type)}
          </Tooltip>
          {/*
            render the entity_name
          */}
          <Tooltip
            position="bottom"
            trigger={(
              <span
                className="custom-cell__entity-name"
                onClick={e => hasOnClickHandler && rowData.handlers.onRowClick(e, rowData)}
              >
                {rowData.entity_name}
              </span>
            )}
          >
            <FormattedMessage id="tooltip.investigate" />
          </Tooltip>
        </div>
      );
    };

    const renderCentralEntity = row => (
      <div className="custom-cell__icon-entity" onClick={e => row.handlers.onRowClick(e, row)}>
        <Tooltip
          position="bottom"
          key={row.central_entity}
          trigger={(
            <span className={mapIcons(row.pipeline)} />
          )}
        >
          {pipelineToName(row.pipeline)}
        </Tooltip>
        <span className="custom-cell__entity-name">
          {row.central_entity}
        </span>
      </div>
    );

    const renderSetLabelButton = (row, userTag) => {
      /*
      * render the user_tag if the entity has it
      */
      if (userTag !== '') {
        return (
          <span>
            {userTag}
            <span
              className="icon-Trash-icon"
              onClick={e => data[row].handlers.deleteLabel(e, data[row].user_tag_id)}
            />
          </span>
        );
      }
      /*
      * otherwise, render the set label button
      */
      return (
        <Button
          className="button--success +small +tableButton"
          onClick={e => data[row].handlers.setLabel(e, row)}
        >
          Set Label
        </Button>
      );
    };

    const renderMethodName = row => (row.method_name === 'ranking' ? 'outlier' : row.method_name);

    const renderThreat = (row) => {
      const tagObject = tagsI18nMapping[row.tag_id] || {};
      return (
        <span className={`threat-cell +${tagObject.class}`}>
          <span className="circle" />
          <span>{row.threat}</span>
        </span>
      );
    };

    const renderDataSourceStatus = row => (
      <span className={`data-source-status data-source-status--${slugify(row.dataSourceStatus)}`}>
        <span>{row.dataSourceStatus}</span>
      </span>
    );

    const renderDataSourceDebug = row => (
      <Toggle
        disabled={row.processingLoading}
        checked={row.dataSourceDebug}
        onValueChange={e => row.handlers.onDebugUpdate(e, row)}
      />
    );

    const renderCapitalize = (rowData) => {
      const hasOnClickHandler = Object.keys(rowData).includes('handlers')
        && Object.keys(rowData.handlers).includes('onRowClick');

      /*
      * add the onRowClick handler if it'e needed
      */
      return (
        <span
          className="capitalize"
          onClick={e => hasOnClickHandler && rowData.handlers.onRowClick(e, rowData)}
        >
          {rowData[columnKey]}
        </span>
      );
    };

    const renderCellWithPercent = (rowData) => {
      const hasOnClickHandler = Object.keys(rowData).includes('handlers')
        && Object.keys(rowData.handlers).includes('onRowClick');

      /*
      * add the onRowClick handler if it'e needed
      */
      return (
        <span
          className="table__cell--percent"
          onClick={e => hasOnClickHandler && rowData.handlers.onRowClick(e, rowData)}
        >
          <span>{rowData[columnKey]}</span>
          <span className="percent">{rowData[`${columnKey}Percent`]}%</span>
        </span>
      );
    };

    const renderSimpleCellContent = (rowData) => {
      const hasOnClickHandler = Object.keys(rowData).includes('handlers')
        && Object.keys(rowData.handlers).includes('onRowClick');

      /*
      * add the onRowClick handler if it'e needed
      */
      return (
        <span onClick={e => hasOnClickHandler && rowData.handlers.onRowClick(e, rowData)}>
          {rowData[columnKey]}
        </span>
      );
    };

    const renderDetails = rowData => (
      <span className="clusterTable__cell" onClick={e => rowData.handlers.onRowClick(e, rowData)}>
        {Object.keys(rowData.counts).map(key => (
          <span key={`key-${key}`} className="clusterTable__count">
            <span className={`icon-${key}`} />
            {parseInt(rowData.counts[key], 10)}
          </span>
        ))}
      </span>
    );

    /*
    * Handle different types of content
    */
    const getCellContent = () => {
      switch (columnKey) {
        /*
        * actions render icons with corresponding action handler
        */
        case 'actions':
          return renderActions(data[rowIndex]);
        /*
        * data source actions render icons with corresponding action handler
        */
        case 'dataSourceActions':
          return renderDataSourceActions(data[rowIndex]);
        /*
        * entity_name usually shows the icon for the entity_type
        * and the entity name
        */
        case 'entity_name':
          return renderIconEntity(data[rowIndex]);
        /*
        * user_tag field should show the 'Set label' button
        * or the tag
        */
        case 'user_tag':
          return renderSetLabelButton(rowIndex, data[rowIndex].user_tag);
        case 'counts':
          return renderDetails(data[rowIndex]);
        case 'central_entity':
          return renderCentralEntity(data[rowIndex]);
        case 'method_name':
          return renderMethodName(data[rowIndex]);
        case 'threat':
          return renderThreat(data[rowIndex]);
        case 'dataSourceStatus':
          return renderDataSourceStatus(data[rowIndex]);
        case 'dataSourceDebug':
          return renderDataSourceDebug(data[rowIndex]);
        case 'logSummarySource':
          return renderCapitalize(data[rowIndex]);
        case 'logSummaryNoEvents':
        case 'logSummaryStorage':
          return renderCellWithPercent(data[rowIndex]);
        default:
          /*
          * rendering just the label
          */
          return renderSimpleCellContent(data[rowIndex]);
      }
    };

    return (
      <Cell {...props}>
        {getCellContent()}
      </Cell>
    );
  }
}

TextCell.displayName = 'TextCell';

TextCell.propTypes = {
  'data': PropTypes.array.isRequired,
  'rowIndex': PropTypes.number.isRequired,
  'columnKey': PropTypes.string,
};

TextCell.defaultProps = {
  'columnKey': '',
};

export default TextCell;
