import { Router } from 'express';
import clustersMOCK from '../../data/clusters.js';

export default () => {
  const clusters = Router();

  clusters.get('/', (req, res) => {
    res.json(clustersMOCK);
  });

  return clusters;
};
