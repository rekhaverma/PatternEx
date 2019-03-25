import { createSelector } from 'reselect';
import { isEqual, isPlainObject } from 'lodash';
import moment from 'moment';
import Tags from 'model/classes/tags.class';

import { createEntityTypeGroup, foundLink } from './relations.selectors';

const clusterDetails = state => state.raw.toJS().explodedView.clusterRelations.clusterDetails;
const clusterEntities = state => state.raw.toJS().explodedView.clusterRelations.clusterEntities;
const tenableReportData = state => state.raw.toJS().explodedView.vulnerabilityReport;
const entityInfo = state => state.raw.toJS().explodedView.entityInfo;
const dhcpData = state => state.raw.toJS().explodedView.dhcpData;
/**
 * Return object of nodes and links for the spider graph on Related Entities tab
 * Parse cluster_entities object and add decorate each entity(node) with beahvior, id, group
 * Parse cluster_relations object and add each edge to links array
 * If predicted_edges property exists, mark the containing edges so they can be highlighted in ui
 */

export const relatedEntitiesToSpider = createSelector(
  clusterDetails,
  clusterEntities,
  (cluster, entitiesDetails) => {
    const output = {
      'nodes': [],
      'links': [],
    };
    const groupMap = createEntityTypeGroup();
    const trimEntityName = str => (str.indexOf('/?') >= 0
      ? `${str.slice(0, str.indexOf('\\/?'))}?...`
      : str);

    if (Object.keys(cluster).includes('cluster_entities')) {
      cluster.cluster_entities
        .forEach((entity) => {
          const entityDetails = entitiesDetails.find(item => item.entity_name === entity);
          if (entityDetails) {
            output.nodes.push({
              'behavior': entityDetails.behavior,
              'id': entityDetails.entity_name,
              'group': groupMap.get(entityDetails.entity_type),
              'entity_name': trimEntityName(entity),
              'is_central_entity': entity === cluster.central_entity,
              'raw': {
                ...entityDetails,
                pipeline: cluster.pipeline,
                model_name: cluster.model_name,
              },
            });
          }
        });
    }

    const hasPredictedLinks = Object.keys(cluster).includes('predicted_edges')
      && cluster.predicted_edges && cluster.predicted_edges.length > 0;

    if (Object.keys(cluster).includes('cluster_relations')) {
      output.links = cluster.cluster_relations
        .filter((relation) => {
          const sourceExists = output.nodes.find(item => item.entity_name === relation[0]);
          const targetExists = output.nodes.find(item => item.entity_name === relation[1]);
          return sourceExists && targetExists;
        })
        .map((relation) => {
          const relationIsPredicted = hasPredictedLinks
            ? foundLink(relation, cluster.predicted_edges)
            : false;

          return {
            'source': relation[0],
            'target': relation[1],
            'value': 1,
            'isPredicted': relationIsPredicted,
          };
        });
    }

    return output;
  },
);

export const relatedEntitiesTable = createSelector(
  clusterDetails,
  clusterEntities,
  (cluster, entitiesDetails) => {
    const output = [];
    const trimEntityName = str => (str.indexOf('/?') >= 0
      ? `${str.slice(0, str.indexOf('\\/?'))}?...`
      : str);

    if (Object.keys(cluster).includes('cluster_entities')) {
      const entitiesDetailed = cluster.cluster_entities
        .map(entity => entitiesDetails.find(item => item.entity_name === entity));

      const entitiesTags = entitiesDetailed
        .map(entity => entity.tag_id)
        .filter((x, i, a) => a.indexOf(x) === i);

      const tagsInstance = new Tags(entitiesTags);
      const tagsFromCache = tagsInstance.constructor.getFromCache();

      const getThreatTactic = (tagId) => {
        if (tagId !== null && tagsFromCache[tagId]) {
          return tagsFromCache[tagId].name || 'Others';
        }
        return 'Others';
      };

      if (Object.keys(cluster).includes('cluster_entities')) {
        cluster.cluster_entities
          .forEach((entity) => {
            const entityDetails = entitiesDetails.find(item => item.entity_name === entity);
            if (entityDetails) {
              output.push({
                'id': entityDetails.entity_name,
                'end_time': moment(entityDetails.ts).format('MM-DD-YYYY'),
                'start_time': moment(entityDetails.ts).subtract(30, 'days').format('MM-DD-YYYY'),
                'entity_name': trimEntityName(entity),
                'behavior': entityDetails.behavior,
                'entity_type': entityDetails.entity_type,
                'threat_tactic': getThreatTactic(entityDetails.tag_id),
                'pipeline': entityDetails.pipeline,
                'actions': 'actions',
              });
            }
          });
      }
    }
    return output;
  },
);


const relatedEntities = state => state.raw.toJS().explodedView.relatedEntities;

/**
 * Return object of sources and connections for IP GeoLocations Map
 * Get data for the main source point from geo_location object
 * Parse items array and add decorated items in sources array
 * For each item in items array, create a new object containing main source's coordinates
 * and item's coordinates and push it to connections array
 */

export const ipGeoLocations = createSelector(
  relatedEntities,
  (raw) => {
    const items = raw.items;
    const entity = raw.entity_name;
    const geoLocation = raw.geo_location;

    const sources = [];
    const connections = [];

    const sourceDecorator = (item, entityName, isPrincipalSource = false) => ({
      'longitude': item.longitude,
      'latitude': item.latitude,
      'city': item.city,
      'srcip': entityName,
      'isSource': isPrincipalSource,
    });

    const connectionDecorator = (source, target) => ({
      'source': [source.longitude, source.latitude],
      'target': [target.longitude, target.latitude],
    });

    if (isPlainObject(geoLocation)) {
      sources.push(sourceDecorator(geoLocation, entity, true));
    }

    // if items array is not empty, there are connections to be drawn
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        if (Object.keys(item).includes('details') && isPlainObject(item.details)) {
          // verify if source is already added in sources array
          let sourceIsAdded = false;
          sources.forEach((source) => {
            if (isEqual(source, items.details)) {
              sourceIsAdded = true;
            }
          });

          if (!sourceIsAdded) {
            sources.push(sourceDecorator(item.details, item.entity_name));
            if (geoLocation) {
              connections.push(connectionDecorator(geoLocation, item.details));
            }
          }
        }
      });
    }
    return {
      'sources': sources,
      'connections': connections,
    };
  },
);

export const externalEnrichmentSelector = createSelector(
  entityInfo,
  (data) => {
    const returnData = [];
    const ipaddr = data.ip_address_info;
    if (ipaddr) {
      if (Object.keys(ipaddr.asn).length > 0 && Object.keys(ipaddr.geo_location).length > 0) {
        returnData.push({
          'dip': 'No dip',
          'asn_id': Object.keys(ipaddr.asn).length > 0 ? ipaddr.asn.number : 'No provider id',
          'asn_provider': Object.keys(ipaddr.asn).length > 0 ? ipaddr.asn.asn_provider : 'No provider',
          'location': Object.keys(ipaddr.geo_location).length > 0 ? ipaddr.geo_location.country_iso_code : 'No country code',
        });
      }
    }

    return returnData;
  },
);

export const getVulnerabilityReportCardData = createSelector(
  tenableReportData,
  (data) => {
    const noDataString = 'No data available';
    if (data.length > 0) {
      return {
        'entityType': noDataString,
        'dnsName': data[0].dns_name || noDataString,
        'netbios': data[0].netbios_name || noDataString,
      };
    }
    return {
      'entityType': noDataString,
      'dnsName': noDataString,
      'netbios': noDataString,
    };
  },
);

export const getSeverityValues = createSelector(
  tenableReportData,
  data => data
    .reduce((acc, value) => {
      if (!acc.includes(value.severity)) {
        return [...acc, value.severity];
      }
      return acc;
    }, [])
    .reduce((acc, value) => {
      if (value) {
        return [
          ...acc,
          {
            'id': value.toLowerCase(),
            'content': value,
          },
        ];
      }

      return acc;
    }, []),
);

export const dhcpFormattedData = createSelector(
  dhcpData,
  data => data
    .reduce((acc, value) =>
      [...acc,
        {
          'date': value[0],
          'ip': value[1],
          'hostname': value[2],
        },
      ], []),
);
