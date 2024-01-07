import { Request, Response } from "express";
import { redisClient } from "../../config/redis";
import { Subdomain } from "@hicagni/very-types/types/subdomain";
import { db } from "../../config/firebase";
import { toApiJson } from "./toApiJson";
import { Product } from "@hicagni/very-types/types/companies/product";

interface ParseSubdomain extends Subdomain {
  pathRef: string;
}


export const getProducts = async (req: Request, res: Response) => {
  try {
    const redis = await redisClient();
    const storageProducts = await redis.get(`products-${req.params.storeName}`);

    if (storageProducts) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(storageProducts),
      });
    }

    const storageDomain = (await redis.get(
      `domain-${req.params.storeName}`
    )) as string;
    let subdomain: ParseSubdomain = JSON.parse(storageDomain);
    const snap = await db
      .collection(subdomain.pathRef + "/productos")
      .where("status", "==", true)
      .where("verified", "==", true)
      .where("availability", "==", "DISPONIBLE")
      .get();
    const data = snap.docs.map(
      async (doc) => await toApiJson(doc.data() as Product)
    );
    const resolveData = await Promise.all(data);

    await redis.set(
      `products-${req.params.storeName}`,
      JSON.stringify(resolveData)
    );

   

    return res.status(200).json({
      success: true,
      data: resolveData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};
