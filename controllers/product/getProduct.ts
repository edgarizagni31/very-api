import { Request, Response } from 'express';
import { redisClient } from '../../config/redis';
import { Subdomain } from '@hicagni/very-types/types/subdomain';
import { db } from '../../config/firebase';
import { Product } from '@hicagni/very-types/types/companies/product';
import { toApiJson } from './toApiJson';

interface ParseSubdomain extends Subdomain {
  pathRef: string;
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const redis = await redisClient();
    const storageDomain = (await redis.get(
      `domain-${req.subdomains[0]}`
    )) as string;
    let subdomain: ParseSubdomain = JSON.parse(storageDomain);
    const storageProducts = await redis.get(`products-${req.subdomains[0]}`);

    if (storageProducts) {
      const products = JSON.parse(storageProducts) as any[];
      const product = products.find(
        (product) => product.id == req.params.productId
      );

      if (product) {
        return res.status(200).json({
          success: true,
          data: product,
        });
      }

      return res.status(404).json({
        success: false,
        message: 'product not found',
      });
    }

    const snap = await db
      .doc(subdomain.pathRef + `/productos/${req.params.productId}`)
      .get();

    if (snap.data()) {
      const data = snap.data() as Product;
      const resolveData = await toApiJson(data);

      return res.status(200).json({
        success: true,
        data: resolveData,
      });
    }

    return res.status(404).json({
      success: false,
      message: 'product not found',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'internal error',
    });
  }
};
