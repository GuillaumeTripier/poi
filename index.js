import express from 'express';
import bodyParser from 'body-parser';
import data from './data';

const app = express();

app.get('/', (req, res) => res.json(data));

app.get('/:search', (req, res) => res.json(
  data.filter(poi => poi.title.toLowerCase()
    .indexOf(req.params.search.toLowerCase()) !== -1
    || (poi.details !== undefined ? poi.details.toLowerCase()
      .indexOf(req.params.search.toLowerCase()) !== -1 : false)),
));

app.post('/', bodyParser.json(), (req, res) => {
  const title = req.body.title;
  const coordinates = req.body.coordinates;
  const type = req.body.type;
  const details = req.body.details;
  if (typeof title === 'string' && typeof coordinates === 'object'
    && typeof type === 'number' && type > 0 && type < 5) {
    const lat = coordinates.lat;
    const lon = coordinates.lon;
    if (typeof lat === 'number' && typeof lon === 'number') {
      if (!details || typeof details === 'string') {
        data.push({
          title,
          type,
          details,
          coordinates,
        });
        return res.status(201).end();
      }
    }
  }
  res.status(400).end();
});

app.delete('/:title', (req, res) => {
  const index = data.findIndex(d => d.title === req.params.title);
  if (index >= 0) {
    data.splice(index, 1);
    return res.status(204).end();
  }
  res.status(404).end();
});

app.put('/:title', bodyParser.json(), (req, res) => {
  const title = req.params.title;
  const index = data.findIndex(d => d.title === title);
  if (index >= 0) {
    const title = req.body.title;
    if (title && typeof title !== 'string') {
      return res.status(400).end();
    }
    const type = req.body.type;
    if (type && (typeof type !== 'number' || (type <= 0 || type > 4))) {
      return res.status(400).end();
    }
    const details = req.body.details;
    if (details && typeof details !== 'string') {
      return res.status(400).end();
    }
    const coordinates = req.body.coordinates;
    if (coordinates && typeof coordinates !== 'object') {
      return res.status(400).end();
    }
    if (coordinates && coordinates.lat && typeof coordinates.lat !== 'number') {
      return res.status(400).end();
    }
    if (coordinates && coordinates.lon && typeof coordinates.lon !== 'number') {
      return res.status(400).end();
    }
    if (title) {
      data[index].title = title;
    }
    if (details) {
      data[index].details = details;
    }
    if (type) {
      data[index].type = type;
    }
    if (coordinates) {
      const c = data[index].coordinates || {};
      if (coordinates.lat) {
        c.lat = coordinates.lat;
      }
      if (coordinates.lon) {
        c.lon = coordinates.lon;
      }
      data[index].coordinates = c;
    }
    return res.status(204).end();
  }
  res.status(404).end();
});


app.listen(process.env.PORT, () => console.log('Listening...'));
