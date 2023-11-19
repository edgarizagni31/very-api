import { NextFunction, Request, Response } from "express";
import { db } from "../config/firebase";
import { redisClient } from "../config/redis";
import { Subdomain } from "@hicagni/very-types/types/subdomain";

export const searchStore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const redis = await redisClient();
    const name = req.subdomains[0];
    const storageDomain = await redis.get(`domain-${name}`);

    if (storageDomain) return next();

    const snap = await db
      .collection("subdomains")
      .where("name", "==", name)
      .get();

    if (snap.empty) {
      return res.status(404).json({
        success: false,
        message: "commerce not register",
      });
    }

    const domain = snap.docs[0].data() as Subdomain;
    const data = {
      ...domain,
      pathRef: domain.ref.path,
    };

    await redis.set(`domain-${name}`, JSON.stringify(data));

    redis.disconnect();

    return next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
