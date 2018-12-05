import express from 'express';

const data = require('./data');

const app = express();

app.get('/', (req, res) => res.json(data));

app.get('/:search', (req, res) => res.json(data.filter(poi => poi.title.toLowerCase().indexOf(req.params.search.toLowerCase()) !== -1 || (poi.details !== undefined ? poi.details.toLowerCase().indexOf(req.params.search.toLowerCase()) !== -1 : false))));

app.listen(process.env.PORT, () => console.log('Listening...'));
