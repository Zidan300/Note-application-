const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
