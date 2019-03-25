import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { CheckBox } from 'components/forms';
import '../multi-select.style';
import AddNewRuleFooterComponent from './addNewRuleFooterComponent.jsx';

/**
 * Menu renderer with the option of
 * adding rule while creating report.
 * @param {object} params
 * @param {object} properties
 */
const MenuRendererCustomReport = (params, properties) => {
  const scrollBarProps = {
    'autoHeight': true,
    'autoHeightMin': 0,
    'autoHeightMax': 200,
  };
  return (
    <div className="menuRendererCR">
      <Scrollbars {...scrollBarProps} className="menuRendererCR__body">
        <div className="Select-menu" role="listbox">
          {
            params.options.map(option => (
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
            ))
          }
        </div>
      </Scrollbars>
      <AddNewRuleFooterComponent onFooterClick={properties.onFooterClick} />
    </div>
  );
};

export default MenuRendererCustomReport;
