import { Router } from 'express';
import labelsMOCK from '../../data/labels.js';

export default () => {
  const labels = Router();

  labels.get('/', (req, res) => {
    res.json(labelsMOCK);
  });

  return labels;
};
