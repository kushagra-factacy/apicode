const express = require('express');

const app = express();

var cors = require('cors')


const dealRoutes = require('./api/routes/deals');

app.use(cors());
app.use('/' ,dealRoutes);


module.exports = app;
