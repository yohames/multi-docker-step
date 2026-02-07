import keys from "./keys.js";
import { createClient } from "redis";

const redisClient = createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
  socket: {
    reconnectStrategy: () => 1000,
  },
});

console.log('🔌 Connecting to Redis...');
const sub = redisClient.duplicate();
await redisClient.connect();
await sub.connect();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

await sub.subscribe('insert', (message) => {
  redisClient.hSet("values", message, fib(parseInt(message)));
});