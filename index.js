import express from 'express';
import bodyParser from 'body-parser';
import data from './data';

const app = express();

app.get('/', (req, res) => res.json(data));

app.get('/:search', (req, res) => res.json(data.filter(poi => poi.title.toLowerCase().indexOf(req.params.search.toLowerCase()) !== -1 || (poi.details !== undefined ? poi.details.toLowerCase().indexOf(req.params.search.toLowerCase()) !== -1 : false))));

app.post('/', bodyParser.json(), (req, res) => {
  const title = req.body.title;
  const coordinates = req.body.coordinates;
  const type = req.body.type;
  const details = req.body.details;
  if (typeof title === 'string' && typeof coordinates === 'object' && typeof type === 'number' && type > 0 && type < 5) {
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

app.listen(process.env.PORT, () => console.log('Listening...'));
