import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import NoData from 'components/no-data';

import { withSearchData } from '../../hoc';
import Section from '../../components/section';
import List, { RELATED_USERS } from '../../components/list';

export const RelatedUsers = (props) => {
  const { searchData, isSearchDataLoaded } = props;

  return (
    <Section size="small" title="Related Users" loaded={isSearchDataLoaded}>
      {Object.keys(searchData).includes('map_users') && searchData.map_users ? (
        <List
          type={RELATED_USERS}
          data={searchData.map_users}
          customClass={{
            base: 'details-card related-users',
            modifiers: ['+rows-highlight'],
          }}
        />
      ) : (
        <NoData
          intlId="global.nodata"
          intlDefault="There is no data to display"
          className="nodata"
          withIcon
        />
      )
      }

    </Section>
  );
};

RelatedUsers.displayName = 'DetailsCard';

RelatedUsers.propTypes = {
  'searchData': PropTypes.object,
  'isSearchDataLoaded': PropTypes.bool,
};

RelatedUsers.defaultProps = {
  'searchData': {},
  'isSearchDataLoaded': false,
};

const enhance = compose(withSearchData);

export default enhance(RelatedUsers);
