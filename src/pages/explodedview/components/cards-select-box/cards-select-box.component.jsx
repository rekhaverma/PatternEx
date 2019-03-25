import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import withBox from 'components/withBox';
import OptionList from 'components/select-box/components/option-list.component';

import './cards-select-box.style.scss';

const CardsSelectBox = (props) => {
  const {
    boxIsOpen,
    openBox,
    options,
    activeOptions,
    updateCardsOptions,
  } = props;

  return (
    <div className="cardsSelectBox">
      <div className={boxIsOpen ? 'cardsSelectBox__box +open' : 'cardsSelectBox__box'} onClick={openBox}>
        <FormattedMessage id="evp.showhidecards" />
        <span className="icon-cog" />
      </div>
      {
        options.length > 0 && boxIsOpen && (
          <OptionList
            autocomplete
            activeOption={activeOptions}
            scrollbar
            options={options}
            singleSelect={false}
            onClick={updateCardsOptions}
          />
        )
      }
    </div>
  );
};

CardsSelectBox.displayName = 'CardsSelectBox';
CardsSelectBox.propTypes = {
  'options': PropTypes.array,
  'activeOptions': PropTypes.array,
  'updateCardsOptions': PropTypes.func,
  'openBox': PropTypes.func.isRequired,
  'boxIsOpen': PropTypes.bool.isRequired,
};
CardsSelectBox.defaultProps = {
  'options': [],
  'activeOptions': [],
  'updateCardsOptions': () => null,
};

export default withBox(CardsSelectBox);
