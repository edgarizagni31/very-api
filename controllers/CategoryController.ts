import { Subdomain } from "@hicagni/very-types/types/subdomain";
import { redisClient } from "../config/redis";
import { db } from "../config/firebase";
import { Request, Response } from "express";
import { Category } from "@hicagni/very-types/types/companies/category";

interface ParseSubdomain extends Subdomain {
  pathRef: string;
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const redis = await redisClient();
    const storageDomain = (await redis.get(
      `domain-${req.subdomains[0]}`
    )) as string;
    let subdomain: ParseSubdomain = JSON.parse(storageDomain);
    const storageCategory = await redis.get(`categories-${req.subdomains[0]}`);

    if (storageCategory) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(storageCategory),
      });
    }

    const snap = await db.collection(subdomain.pathRef + "/categorias").get();
    const data = snap.docs
      .map((doc) => doc.data() as Category)
      .filter((category) => category.status)
      .map((category) => ({
        id: category.id,
        name: category.name,
      }));

    await redis.set(`categories-${req.subdomains[0]}`, JSON.stringify(data));

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};
