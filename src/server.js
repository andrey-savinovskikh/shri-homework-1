const http = require('http');
const express = require('express');

const { PORT } = require('./config');
const { router } = require('./router');
const {NotFoundApiError} = require("./errors/ApiError");

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/', router);

app.use(function() {
  throw new NotFoundApiError();
});

app.use(errorHandler);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
