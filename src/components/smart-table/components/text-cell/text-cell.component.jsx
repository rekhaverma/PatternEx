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
import { Toggle } from 'components/toggle';

export class TextCell extends React.PureComponent {
  renderWithTooltip(tooltip, element) {
    const { columnConfig } = this.props;

    return (
      <Tooltip
        position="bottom"
        trigger={element}
      >
        <span>{columnConfig.tooltip || tooltip}</span>
      </Tooltip>
    );
  }

  renderSimpleCellContent(data) {
    if (!data) {
      return null;
    }
    const { className, columnKey } = this.props;

    const hasOnClickHandler = Object.keys(data).includes('handlers')
      && Object.keys(data.handlers).includes('onRowClick');

    return (
      <span
        className={`${className}__cell--simple`}
        onClick={e => hasOnClickHandler && data.handlers.onRowClick(e, data)}
      >
        {this.renderWithTooltip(data[columnKey], (<span>{data[columnKey]}</span>))}
      </span>
    );
  }

  renderActionsCellContent(data) {
    const { className } = this.props;
    const renderInspectAction = Object.keys(data.handlers).includes('onInspect');
    const renderConfirmAction = Object.keys(data.handlers).includes('onConfirm');
    const labelId = data.user_tag ? data.user_tag.label_id : null;
    const labelName = data.user_tag ? data.user_tag.name : null;
    let newTabUrl = false;
    if (renderInspectAction) {
      newTabUrl = data.handlers.getNewTabUrl(data);
    }
    return (
      <span className={`${className}__cell--actions`}>
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
                  onClick={e => data.handlers.onInspect(e, data)}
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
              onClick={e => data.handlers.onConfirm(e, data)}
            >
              Set Label
            </Button>
          )
        }
        {
          labelName && (
            <Tag
              label={labelName}
              onRemove={e => data.handlers.deleteLabel(e, data)}
            />
          )
        }
      </span>
    );
  }

  renderDataSourceActionsCellContent(data) {
    const { className } = this.props;
    const renderViewAction = Object.keys(data.handlers).includes('onViewDetails');
    const renderStartAction = Object.keys(data.handlers).includes('onStart') &&
      data.status !== 'running';
    const renderStopAction = Object.keys(data.handlers).includes('onStop') &&
      data.status === 'running';
    const renderDeleteAction = Object.keys(data.handlers).includes('onDelete');

    let finalClassName = `${className}__cell--actions ${className}__cell--data-source-actions`;
    if (data.processingLoading) {
      finalClassName += ` ${className}__cell--disabled`;
    }
    return (
      <span className={finalClassName}>
        {
          renderViewAction && (
            <Tooltip
              position="bottom"
              trigger={(
                <span
                  className="icon-information"
                  onClick={e => data.handlers.onViewDetails(e, data)}
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
                  onClick={e => data.handlers.onStart(e, data)}
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
                  onClick={e => data.handlers.onStop(e, data)}
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
                  onClick={e => data.handlers.onDelete(e, data)}
                />
              )}
            >
              <FormattedMessage id="tooltip.delete" />
            </Tooltip>
          )
        }
      </span>
    );
  }

  renderIconEntityCellContent(data) {
    const { className } = this.props;
    const hasOnClickHandler = Object.keys(data).includes('handlers')
      && Object.keys(data.handlers).includes('onRowClick');

    return (
      <div
        className={`${className}__cell--entity-icon`}
        key={data.entity_name}
      >
        <Tooltip
          position="bottom"
          trigger={(
            <span className={mapIcons(data.entity_type)} />
          )}
        >
          {pipelineToName(data.entity_type)}
        </Tooltip>
        <Tooltip
          position="bottom"
          trigger={(
            <span
              className={`${className}__cell--entity-name`}
              onClick={e => hasOnClickHandler && data.handlers.onRowClick(e, data)}
            >
              {data.entity_name}
            </span>
          )}
        >
          <FormattedMessage id="tooltip.investigate" />
        </Tooltip>
      </div>
    );
  }

  renderSetLabelButtonCellContent(data) {
    const { className } = this.props;
    /*
     * render the user_tag if the entity has it
     */
    if (data.user_tag !== '') {
      return (
        <span className={`${className}__cell--user-tag`}>
          {data.user_tag}
          <span
            className="icon-Trash-icon"
            onClick={e => data.handlers.deleteLabel(e, data.user_tag_id)}
          />
        </span>
      );
    }
    /*
    * otherwise, render the set label button
    */
    return (
      <span className={`${className}__cell--user-tag`}>
        <Button
          className="button--success +small +tableButton"
          onClick={e => data.handlers.setLabel(e, data)}
        >
          <FormattedMessage id="evp.setLabel" />
        </Button>
      </span>
    );
  }

  renderDetailsCellContent(data) {
    const { className } = this.props;
    return (
      <span className={`${className}__cell--cluster-table`} onClick={e => data.handlers.onRowClick(e, data)}>
        {Object.keys(data.counts).map(key => (
          <span key={`key-${key}`} className="clusterTable__count">
            <span className={`icon-${key}`} />
            {parseInt(data.counts[key], 10)}
          </span>
        ))}
      </span>
    );
  }

  renderCentralEntityCellContent(data) {
    const { className } = this.props;
    return (
      <div className={`${className}__cell--entity-icon`} onClick={e => data.handlers.onRowClick(e, data)}>
        {this.renderWithTooltip(
          pipelineToName(data.pipeline),
          (
            <span className={mapIcons(data.pipeline)} />
          ),
        )}
        {this.renderWithTooltip(
          data.central_entity,
          (
            <span className={`${className}__cell--entity-name`}>{data.central_entity}</span>
          ),
        )}
      </div>
    );
  }

  renderMethodNameCellContent(data) {
    const { className } = this.props;
    const displayedValue = data.method_name === 'ranking' ? 'outlier' : data.method_name;
    return this.renderWithTooltip(displayedValue, (<span className={`${className}__cell--method-name`}>{displayedValue}</span>));
  }

  renderThreatCellContent(data) {
    const { className } = this.props;
    const tagObject = tagsI18nMapping[data.tag_id] || {};
    return this.renderWithTooltip(
      data.threat,
      (
        <span className={`${className}__cell--threat +${tagObject.class}`}>
          <span className="circle" />
          <span>{data.threat}</span>
        </span>
      ),
    );
  }

  renderDataSourceStatus(data) {
    const { className } = this.props;
    return this.renderWithTooltip(
      (<span className="capitalize">{data.dataSourceStatus}</span>),
      (
        <span className={`${className}__cell--data-source-status +${slugify(data.dataSourceStatus)}`}>
          <span>{data.dataSourceStatus}</span>
        </span>
      ),
    );
  }

  renderDataSourceDebug(data) {
    const { className, columnConfig } = this.props;
    return this.renderWithTooltip(
      (`${columnConfig.label} ${data.dataSourceDebug ? 'On' : 'Off'}`),
      (
        <div className={`${className}__cell--data-source-debug`}>
          <Toggle
            disabled={data.processingLoading}
            checked={data.dataSourceDebug}
            onValueChange={e => data.handlers.onDebugUpdate(e, data)}
          />
        </div>
      ),
    );
  }

  renderCapitalizeCellContent(data) {
    if (!data) {
      return null;
    }
    const { className, columnKey } = this.props;
    const hasOnClickHandler = Object.keys(data).includes('handlers')
      && Object.keys(data.handlers).includes('onRowClick');

    return (
      <span
        className={`${className}__cell--capitalize`}
        onClick={e => hasOnClickHandler && data.handlers.onRowClick(e, data)}
      >
        {this.renderWithTooltip(
          (<span className="capitalize">{data[columnKey]}</span>),
          (<span>{data[columnKey]}</span>),
        )}
      </span>
    );
  }

  renderWithPercentCellContent(data) {
    if (!data) {
      return null;
    }
    const { className, columnKey } = this.props;
    const hasOnClickHandler = Object.keys(data).includes('handlers')
      && Object.keys(data.handlers).includes('onRowClick');

    /*
    * add the onRowClick handler if it'e needed
    */
    return (
      <span
        className={`${className}__cell--percent`}
        onClick={e => hasOnClickHandler && data.handlers.onRowClick(e, data)}
      >
        <span>{data[columnKey]}</span>
        <span className="percent">{data[`${columnKey}Percent`]}%</span>
      </span>
    );
  }

  renderCellContent() {
    const { data, rowIndex, columnKey } = this.props;

    switch (columnKey) {
      case 'actions':
        return this.renderActionsCellContent(data[rowIndex]);
      case 'dataSourceActions':
        return this.renderDataSourceActionsCellContent(data[rowIndex]);
      case 'entity_name':
        return this.renderIconEntityCellContent(data[rowIndex]);
      case 'user_tag':
        return this.renderSetLabelButtonCellContent(data[rowIndex]);
      case 'counts':
        return this.renderDetailsCellContent(data[rowIndex]);
      case 'central_entity':
        return this.renderCentralEntityCellContent(data[rowIndex]);
      case 'method_name':
        return this.renderMethodNameCellContent(data[rowIndex]);
      case 'threat':
        return this.renderThreatCellContent(data[rowIndex]);
      case 'dataSourceStatus':
        return this.renderDataSourceStatus(data[rowIndex]);
      case 'dataSourceDebug':
        return this.renderDataSourceDebug(data[rowIndex]);
      case 'logSummarySource':
        return this.renderCapitalizeCellContent(data[rowIndex]);
      case 'logSummaryNoEvents':
      case 'logSummaryStorage':
        return this.renderWithPercentCellContent(data[rowIndex]);
      default:
        return this.renderSimpleCellContent(data[rowIndex]);
    }
  }

  render() {
    const { columnConfig, className } = this.props;
    let cellClassName = `${className}__cell`;

    if (columnConfig.sort) {
      cellClassName += ` ${className}__cell--sortable`;
    }

    if (columnConfig.cellClass) {
      cellClassName += ` ${className}__cell--${columnConfig.cellClass}`;
    }

    return (
      <Cell>
        <div className={cellClassName}>
          {this.renderCellContent()}
        </div>
      </Cell>
    );
  }
}

TextCell.propTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number.isRequired,
  columnKey: PropTypes.string.isRequired,
  columnConfig: PropTypes.object.isRequired,
  className: PropTypes.string,
};

TextCell.defaultProps = {
  className: 'smart-table',
};
