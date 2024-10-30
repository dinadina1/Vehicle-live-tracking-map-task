// required modules
const express = require('express');
const app = express();
const vehicle = require('./route/vehicle');
const cors = require('cors');

// cors
app.use(cors());
app.use(express.json());

// routes
app.use('/api/v1', vehicle);

// export app
module.exports = app;