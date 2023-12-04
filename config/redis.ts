import { createClient } from "redis";
import * as dotenv from "dotenv";


dotenv.config();


export const redisClient = async () => {
  return await createClient({
    url: process.env.REDIS_URL
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
};
