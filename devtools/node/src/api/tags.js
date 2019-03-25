import { Router } from 'express';
import tagsMOCK from '../../data/tags.js';

export default () => {
  const tags = Router();

  tags.get('/', (req, res) => {
    res.json(tagsMOCK);
  });

  return tags;
};
