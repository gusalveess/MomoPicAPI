const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const memoriesRouter = require('./routes/memories');
const promisesRouter = require('./routes/promises');

dotenv.config(); 

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.locals.pool = pool;


app.use('/api/memories', memoriesRouter);
app.use('/api/promises', promisesRouter);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});