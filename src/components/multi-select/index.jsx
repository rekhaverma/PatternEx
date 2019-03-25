import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { CheckBox } from 'components/forms';
import MenuRendererCustomReport from './menuRenderer/menuRendererCR';
import AddNewRuleFooterComponent from './menuRenderer/addNewRuleFooterComponent.jsx';

import './multi-select.style.scss';

const menuRenderer = (params) => {
  const scrollBarProps = {
    'autoHeight': true,
    'autoHeightMin': 0,
    'autoHeightMax': 200,
  };
  let className;
  return (
    <Scrollbars {...scrollBarProps}>
      <div className="Select-menu" role="listbox">
        {params.options.map((option) => {
          className = 'Select-menu__menu';
          if (option.value === 'clear_all' || option.value === 'add_all') {
            className = 'Select-menu__menu--control';
            return (
              <div
                key={option.value}
                id={option.value}
                className={className}
                onClick={() => params.selectValue(option)}
                onMouseOver={() => params.focusOption(option)}
                onFocus={() => params.focusOption(option)}
              >
                {option.label}
              </div>
            );
          }
          return (
            <CheckBox
              key={option.value}
              id={option.value}
              onChange={() => params.selectValue(option)}
              onMouseOver={() => params.focusOption(option)}
              onFocus={() => params.focusOption(option)}
              checked={params.valueArray.indexOf(option) !== -1}
              label={option.label}
              value={option.value}
            />
          );
        })}
      </div>
    </Scrollbars>
  );
};

/**
 * Calculating the height of the scrollbar
 * with respect to the client viewport
 * @param  {sring} id elementId
 * @return {Number} calculated height of the scrollbar
 */
const getDynamicHeight = (id) => {
  const viewPortHeight = document.documentElement.clientHeight;
  const elem = document.querySelector(`#${id}`);
  let calculatedHeight = 200;
  if (elem instanceof HTMLElement) {
    const { top, height } = elem.getBoundingClientRect();
    const totalHeightOfElem = top + height;
    calculatedHeight = viewPortHeight - totalHeightOfElem - 70;
  }
  return calculatedHeight;
};

/**
 * A menurender that presents the list with the set of
 * 4 columns.
 * @param  {object} params     react-select object
 * @param  {object} properties props of multi-select
 * @return {ReactElement}
 */
const menuRendererV2 = (params, properties) => {
  const { headerOptions, id } = properties;
  const scrollBarProps = {
    'autoHeight': true,
    'autoHeightMin': 0,
    'autoHeightMax': getDynamicHeight(id),
  };
  return (
    <div className="multi-select">
      <div className="multi-select__header">
        {
          headerOptions.map((option, index) => (
            <span
              key={index}
              id={option.value}
              onClick={() => params.selectValue(option)}
              onMouseOver={() => params.focusOption(option)}
              onFocus={() => params.focusOption(option)}
            >
              {option.label}
            </span>
          ))
        }
      </div>
      <Scrollbars {...scrollBarProps}>
        <div className="Select-menu" role="listbox" id="multi-selectV2">
          {
            params.options.map((option, index) => (
              <span className="checkboxWithLabel" title={`${option.label}: \n${option.description}`} key={index}>
                <CheckBox
                  key={index}
                  id={option.value}
                  onChange={() => params.selectValue(option)}
                  onMouseOver={() => params.focusOption(option)}
                  onFocus={() => params.focusOption(option)}
                  checked={params.valueArray.indexOf(option) !== -1}
                  label={option.label}
                  value={option.value}
                />
              </span>
            ))
          }
        </div>
      </Scrollbars>
    </div>
  );
};

const getMenuRenderer = (type, params, props) => {
  switch (type) {
    case 'withHeader':
      return menuRendererV2(params, props);
    case 'customReportSpecific':
      return MenuRendererCustomReport(params, props);
    default:
      return menuRenderer(params);
  }
};

/*
* adding with to the span element of the checkbox component
* to enable the ellipsis.
*/
const addFixedWidth = () => {
  const parentContainer = document.getElementById('multi-selectV2');
  const allChildren = document.querySelectorAll('.checkboxWithLabel .check-label');
  allChildren.forEach((node) => {
    const elem = node;
    elem.style.width = `${String((parentContainer.offsetWidth / 4) - 35)}px`;
  });
};

const MultiSelect = (props) => {
  const { handleSelectChange, value, options, placeholder, type } = props;
  return (
    <Select
      closeOnSelect={false}
      disabled={false}
      removeSelected={false}
      multi
      onOpen={() => (type === 'withHeader' ? addFixedWidth() : () => {})}
      onChange={handleSelectChange}
      options={options}
      placeholder={placeholder}
      simpleValue
      value={value}
      noResultsText={type === 'customReportSpecific'
        ? (<AddNewRuleFooterComponent onFooterClick={props.onFooterClick} />)
      : 'No results found'}
      menuRenderer={params => getMenuRenderer(type, params, props)}
    />
  );
};

MultiSelect.propTypes = {
  'handleSelectChange': PropTypes.func.isRequired,
  'value': PropTypes.string.isRequired,
  'options': PropTypes.array.isRequired,
  'placeholder': PropTypes.string,
  'type': PropTypes.string,
  'onFooterClick': PropTypes.func,
};

MultiSelect.defaultProps = {
  'placeholder': 'Select features',
  'type': '',
  'onFooterClick': () => {},
};

export default MultiSelect;
