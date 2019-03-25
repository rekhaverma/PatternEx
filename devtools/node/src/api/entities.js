import { Router } from 'express';
import moment from 'moment';
import entitiesMOCK from '../../data/entities.js';

export default () => {
  const entities = Router();

  entities.get('/', (res) => {
    res.json({ 'url': 'api/v0.1/cluster_entities' });
  });

  entities.get('/:startDate', (req, res) => {
    const { limit = 100, start = 0 } = req.query;
    const response = {
      'totalCount': 0,
      'items': [],
      'day_ts': moment(req.params.startDate).format(),
      'limit': parseInt(limit, 10),
      'start': parseInt(start, 10),
    };

    if (req.params.startDate === '2017-09-21') {
      const data = entitiesMOCK.items.slice(
        parseInt(start, 10),
        parseInt(start, 10) + parseInt(limit, 10),
      );
      response.items = data;
      response.totalCount = data.length;
    }

    res.json(response);
  });

  return entities;
};
