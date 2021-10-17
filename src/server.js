const express = require('express');
const cookieParser  = require('cookie-parser');
require('dotenv').config();
require('./database');

const server = express();

const port = process.env.PORT || 8080;

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cookieParser());


server.use('/', require('./router'));

server.use((req, res, next) => {
  next(new Error('Ruta no encontrada'));
});

server.use((req, res) =>
  res.status(404).send('Estos no son los androides que buscas')
);

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
