import keys from "./keys.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Pool } from "pg";
import { createClient } from "redis";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Client Setup
const pgClient = new Pool({
  host: keys.pgHost,
  user: keys.pgUser,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});


pgClient.on("error", () => console.log("Lost PG connection"));

pgClient.on('connect', () => {
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));
});

// Redis Client Setup
const redisClient = createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const redisPublisher = redisClient.duplicate();
console.log('💻💻💻 Server Connecting to Redis...');

await redisClient.connect();
await redisPublisher.connect();

app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  try {
    const values = await redisClient.hGetAll('values');
    res.send(values);
  } catch (err) {
    res.status(500).send('Error fetching current values');
  }
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hSet('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log('✅Listening . . . on port 5000');
});