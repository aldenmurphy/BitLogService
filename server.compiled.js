// server.js

const express = require('express');
const { Pool, Client } = require('pg');

const app = express();

console.log("Starting express server on", process.env.PORT);

app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.set('port', process.env.PORT || 4001);

// pools will use environment variables
// for connection information
const pool = new Pool({
  user: 'postgres',
  host: 'logbook.cblaufv8epj8.us-east-1.rds.amazonaws.com',
  database: 'logbook',
  password: 'B!tt3rsw33t2D0',
  port: 5432
});

console.log("Initialization complete.");

const COLUMNS = ['record', 'created'];

app.get('/api/records', (req, res) => {

  let queryString = `SELECT id, user_id, record, created from bitlog.log WHERE user_id = '4c867b19-2c1e-4181-848f-4179b66336aa' ORDER BY created DESC`;

  pool.query(queryString, function (err, result, fields) {

    if (err) throw err;

    console.log(result.rows);
    return res.json(result.rows);
  });
});

app.post('/api/record', (req, res) => {

  console.log(req.body);

  var user_id = req.body.user_id;
  var record = req.body.record;

  var test = 'test';

  const query = {
    text: 'INSERT INTO bitlog.log(user_id, record) VALUES($1, $2)',
    values: [user_id, record]
  };

  let response = '';
  pool.query(query, (qyueryErr, queryRes) => {
    if (qyueryErr) {
      console.log(queryErr.stack);
      return res.send(queryErr.stack);
    } else {
      console.log(queryRes.rows[0]);
      return res.send(queryRes.rows[0]);
    }
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
