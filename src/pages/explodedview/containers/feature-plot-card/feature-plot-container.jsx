import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchModelDetails } from 'model/actions/rest/models.actions';
import { allFeatureDictionary, featureSelectOption } from 'model/selectors';
import NoData from 'components/no-data';

import BoxPlotList from './components/box-plot-list';
import Section from '../../components/section';

class FeaturePlot extends PureComponent {
  constructor(props) {
    super(props);
    const { searchData } = this.props;
    const topNFeatures = (searchData && searchData.top_n_features) || [];
    this.state = {
      'isDropDownOpen': false,
      'selectedDropDown': [...topNFeatures],
      'selectedFeature': null,
      'searchText': '',
      'sort': '',
    };
    this.onDropDownClick = this.onDropDownClick.bind(this);
    this.onDropDownSelection = this.onDropDownSelection.bind(this);
    this.onListedFeatureSelect = this.onListedFeatureSelect.bind(this);
    this.filterFeatureList = this.filterFeatureList.bind(this);
    this.onSortByDeviation = this.onSortByDeviation.bind(this);
  }
  componentDidMount() {
    const { modelName } = this.props;
    if (modelName) {
      this.props.fetchModelDetails(modelName, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { searchData } = this.props;
    const topNFeatures = (searchData && searchData.top_n_features) || [];
    if (this.props.searchData !== nextProps.searchData) {
      this.setState({
        'selectedDropDown': [...topNFeatures],
      });
    }

    if (nextProps.modelName && nextProps.modelName !== this.props.modelName) {
      this.props.fetchModelDetails(nextProps.modelName, true);
    }
  }
  onDropDownClick() {
    this.setState({
      'isDropDownOpen': !this.state.isDropDownOpen,
    });
  }

  /**
   * Update selectedDropDown state on checkbox (checked and unchecked) event
   *
   * @param {String} value,
   * @param {Boolean} checked,
   */
  onDropDownSelection(value, checked) {
    const { selectedDropDown, selectedFeature } = this.state;
    if (checked) {
      this.setState({
        'selectedDropDown': [...selectedDropDown, value.id],
      });
    } else {
      const index = selectedDropDown.indexOf(value.id);
      const temp = selectedDropDown.slice(0);
      temp.splice(index, 1);
      if (selectedFeature && value.content === selectedFeature.displayName) {
        this.setState({
          'selectedFeature': null,
          'selectedDropDown': [...temp],
        });
      } else {
        this.setState({
          'selectedDropDown': [...temp],
        });
      }
    }
  }
  onListedFeatureSelect(graphProperties) {
    this.setState({
      'selectedFeature': graphProperties,
    });
  }
  onSortByDeviation() {
    const { sort } = this.state;
    this.setState({
      'sort': sort === 'asc' ? 'desc' : 'asc',
    });
  }
  filterFeatureList(event) {
    this.setState({
      'searchText': event.target.value,
    });
  }
  render() {
    const { isDropDownOpen, selectedDropDown, searchText, sort } = this.state;
    const { isLoading, columnFormat, modelDetails, searchData, featureDictionary } = this.props;
    const modelFeatureMinMax = (modelDetails && modelDetails.feature_minmax) || {};
    const isModelFeatureMinMaxEmpty = Object.keys(modelFeatureMinMax).length === 0;
    const isSearchDataEmpty = !searchData || Object.keys(searchData).length === 0;

    // filteredColumnFormat
    const options = columnFormat.filter(feature => feature.content.includes(searchText));

    return (
      <Section
        size="small"
        title="Entity vs. Population"
        className=""
        loaded={!isLoading}
        dropdown
        dropDownState={isDropDownOpen}
        dropDownOptions={options}
        selectedDropDown={selectedDropDown}
        onDropDownClick={this.onDropDownClick}
        onDropDownSelection={this.onDropDownSelection}
        filterFeatureList={this.filterFeatureList}
      >
        {
          (isModelFeatureMinMaxEmpty || isSearchDataEmpty) && (
            <NoData
              intlId="global.nodata"
              intlDefault="There is no data to display"
              className="nodata--labelcard"
              withIcon
            />
          )
        }
        { !isModelFeatureMinMaxEmpty && !isSearchDataEmpty
            && selectedDropDown.length > 0 && (
              <BoxPlotList
                sort={sort}
                modelHistogram={modelFeatureMinMax}
                searchData={searchData}
                selectedDropDown={selectedDropDown}
                featureDictionary={featureDictionary}
                onListedFeatureSelect={this.onListedFeatureSelect}
                onSortByDeviation={this.onSortByDeviation}
              />
            )
        }
        { !isModelFeatureMinMaxEmpty && !isSearchDataEmpty
            && selectedDropDown.length === 0 &&
          (
            <NoData
              intlId="evp.nofeaturedata"
              intlDefault="There is no feature selected"
              className="nodata--labelcard"
              withIcon
            />
          )
        }
      </Section>
    );
  }
}

FeaturePlot.propTypes = {
  'searchData': PropTypes.object.isRequired,
  'fetchModelDetails': PropTypes.func.isRequired,
  'featureDictionary': PropTypes.object.isRequired,
  'columnFormat': PropTypes.array.isRequired,
  'isLoading': PropTypes.bool,
  'modelDetails': PropTypes.object,
  'modelName': PropTypes.string,
};

FeaturePlot.defaultProps = {
  'isLoading': false,
  'modelDetails': {},
  'modelName': '',
};

const mapStateToProps = state => ({
  'isLoading': state.data.models.toJS().isLoading,
  'columnFormat': featureSelectOption(state),
  'modelDetails': state.data.models.toJS().modelDetails,
  'featureDictionary': allFeatureDictionary(state),
});

const mapDispatchToProps = dispatch => ({
  'fetchModelDetails': (modelName, details) => dispatch(fetchModelDetails(modelName, details)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeaturePlot);
