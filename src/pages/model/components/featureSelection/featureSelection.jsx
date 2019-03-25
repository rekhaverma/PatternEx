import React from 'react';
import Search from 'components/search';
import { FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { clone } from 'lodash';
import { Button, RadioButton, CheckBox } from 'components/forms';
import NoData from 'components/no-data';
import { entityFeature, tabsIdToName } from '../../../explodedview/config';

import './featureSelection.style';

/**
 * Getting the features based on a filter and
 * pipeline from all features i.e, totalFeatures
 * @param {string} pipeline
 * @param {string} filter
 * @param {array} totalFeatures
 */
const getFeatures = (pipeline, filter, totalFeatures) =>
  totalFeatures
    .filter((feature) => {
      const filteredFeatures = entityFeature[pipeline][filter];
      return filteredFeatures.includes(feature.value);
    });

/**
 * removing item from an array
 * @param {any} value
 * @param {array} arr
 */
const removeItemFromArray = (value, arr) => {
  const index = arr.indexOf(value);
  if (arr.length < 0 || index < 0) return [];
  arr.splice(index, 1);
  return arr;
};

/**
 * adding fixed width to the span of checkboxes
 * to allow ellipsis
 */
const addFixedWidth = () => {
  const parentContainer = document.getElementsByClassName('featureSelection__featuresList__listing');
  const allChildren = document.querySelectorAll('.featureSelection__featuresList__listing__checkboxWithLabel .check-label');
  allChildren.forEach((node) => {
    const elem = node;
    elem.style.width = `${String((parentContainer[0].offsetWidth) - 35)}px`;
  });
};

class FeatureSelection extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'selectedFilter': args[0].filters[0],
      'selectedFeatures': args[0].selected,
      'inputValue': '',
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleFeatureChange = this.handleFeatureChange.bind(this);
    this.resetSelectedFeatures = this.resetSelectedFeatures.bind(this);
    this.addFeatures = this.addFeatures.bind(this);
  }

  componentDidMount() {
    addFixedWidth();
  }

  componentDidUpdate() {
    addFixedWidth();
  }

  handleOptionChange(e) {
    this.setState({
      'selectedFilter': e.target.value,
    });
  }

  handleFeatureChange(e) {
    let arr = clone(this.state.selectedFeatures);
    const checked = e.target.checked;
    const value = e.target.value;
    if (checked) {
      arr.push(value);
    } else {
      arr = removeItemFromArray(value, arr);
    }
    this.setState({
      'selectedFeatures': arr,
    });
  }

  resetSelectedFeatures() {
    this.setState({
      'selectedFeatures': [],
    });
  }

  addFeatures() {
    const { selectedFeatures } = this.state;
    this.props.onSelect(selectedFeatures);
  }

  render() {
    const { onClose, filters, pipeline, features } = this.props;
    const { selectedFilter, selectedFeatures, inputValue } = this.state;
    let filteredFeatures = getFeatures(pipeline, selectedFilter, features);
    filteredFeatures = filteredFeatures
      .filter(feature => (feature.label.toLowerCase()).includes(inputValue.toLowerCase()));
    return (
      <section className="featureSelection">
        <div
          className="featureSelection__row featureSelection__heading +spaceBetween +marginBottom"
        >
          <span className="featureSelection__heading__text">
            <FormattedHTMLMessage
              id="model.features.addFeatures"
            />
          </span>
          {
            selectedFeatures.length > 0 && (
              <span className="featureSelection__heading__selectedText">
                <FormattedHTMLMessage
                  id="model.features.featureSelectedCount"
                  values={{
                    'count': selectedFeatures.length,
                  }}
                />
                <span
                  className="icon-error"
                  onClick={this.resetSelectedFeatures}
                />
              </span>
            )
          }
          <span
            className="icon-close2"
            onClick={onClose}
          />
        </div>
        <div className="featureSelection__row +marginBottom featureSelection__featureSection">
          <div className="featureSelection__column featureSelection__filters">
            <span
              className="featureSelection__filters__heading"
            >
              <FormattedHTMLMessage
                id="model.features.filters"
              />
            </span>
            <div className="featureSelection__filters__values">
              {
                filters.map(filter => (
                  <RadioButton
                    key={filter}
                    id={`filter_${filter}`}
                    name="filters"
                    label={tabsIdToName(filter)}
                    value={filter}
                    checked={this.state.selectedFilter === filter}
                    onChange={event => this.handleOptionChange(event)}
                  />
                ))
              }
            </div>
          </div>
          <div className="featureSelection__column featureSelection__featuresList">
            <div className="featureSelection__row +spaceBetween">
              <span
                className="featureSelection__featuresList__heading"
              >
                <FormattedHTMLMessage
                  id="model.features.features"
                />
              </span>
              <Search
                className="featureSelection__search"
                inputProps={{
                  'placeholder': 'Search for features',
                  'value': inputValue,
                  'onChange': e => this.setState({ 'inputValue': e.target.value }),
                }}
              />
            </div>
            <div
              className="featureSelection__featuresList__listing"
            >
              {
                filteredFeatures.length > 0 ?
                  filteredFeatures.map(option => (
                    <span className="featureSelection__featuresList__listing__checkboxWithLabel" title={`${option.label}: \n${option.description}`} key={option.value}>
                      <CheckBox
                        key={option.value}
                        id={option.value}
                        onChange={e => this.handleFeatureChange(e)}
                        onMouseOver={() => null}
                        onFocus={() => null}
                        checked={selectedFeatures.indexOf(option.value) !== -1}
                        label={option.label}
                        value={option.value}
                        name="features"
                      />
                    </span>
                  )) :
                  (
                    <NoData
                      withIcon
                      intlId="model.features.noFeatures"
                    />
                  )
              }
            </div>
          </div>
        </div>
        <div className="featureSelection__row +right +marginBottom">
          <Button
            className="button--dark +small"
            onClick={onClose}
          >
            <FormattedHTMLMessage
              id="model.features.cancel"
            />
          </Button>
          <Button
            className="button--success +small"
            onClick={this.addFeatures}
          >
            <FormattedHTMLMessage
              id="model.features.addFeatures"
            />
          </Button>
        </div>
      </section>
    );
  }
}

FeatureSelection.propTypes = {
  'onClose': PropTypes.func.isRequired,
  'filters': PropTypes.array.isRequired,
  'pipeline': PropTypes.string.isRequired,
  'features': PropTypes.array.isRequired,
  'onSelect': PropTypes.func.isRequired,
};

export default FeatureSelection;
