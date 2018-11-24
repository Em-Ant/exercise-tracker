const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');

const app = express();

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/', (_, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
})
app.use('/api', api);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server listening on port ${port}`));
