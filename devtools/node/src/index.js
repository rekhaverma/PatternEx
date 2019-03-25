import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import api from './api';

const app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(cors());

app.use(bodyParser.json({
  'limit': 10000,
}));

app.use('/api', api({}));

app.get('/', (req, res) => {
  res.send('GET request to the homepage');
});

app.server.listen(process.env.PORT || 3000, () => {
  console.log(`Started on port ${app.server.address().port}`);
});
