import { connect } from 'react-redux';
import { externalEnrichmentSelector } from 'model/selectors';

export const withDomainInfoData = (subscriber) => {
  const mapStateToProps = state => ({
    'isDomainInfoDataLoaded': state.raw.toJS().loadStatus.entityInfoDataLoaded || false,
    'domainInfoData': state.raw.toJS().explodedView.entityInfo.domain_info,
  });

  return connect(mapStateToProps)(subscriber);
};

export const withExternalEnrichmentData = (subscriber) => {
  const mapStateToProps = state => ({
    'isExternalEnrichmentDataLoaded': state.raw.toJS().loadStatus.entityInfoDataLoaded || false,
    'externalEnrichmentData': externalEnrichmentSelector(state),
  });

  return connect(mapStateToProps)(subscriber);
};
