import { createClient } from "redis";

export const redisClient = async () => {
  return await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
};
