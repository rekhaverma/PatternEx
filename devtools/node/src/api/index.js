
import { Router } from 'express';
import entities from './entities';
import relations from './relations';
import tags from './tags';
import labels from './labels';

import { version } from '../../package.json';

export default () => {
  const api = Router();

  api.use(`/v${version}/cluster_entities`, entities({}));

  api.use(`/v${version}/cluster_relations`, relations({}));

  api.use(`/v${version}/tags`, tags({}));

  api.use(`/v${version}/labels`, labels({}));

  api.get(`/v${version}`, (req, res) => {
    res.json({ version });
  });

  return api;
};
