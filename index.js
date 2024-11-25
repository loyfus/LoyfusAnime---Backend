const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const topAnimesRoute = require('./routes/topAnimes');

app.use(cors());
app.use('/top-animes', topAnimesRoute);


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
