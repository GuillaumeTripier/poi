const express = require('express');

const app = express();

app.get('/', (req, res) => res.json({}));

app.listen(process.env.PORT, () => console.log('Listening...'));
