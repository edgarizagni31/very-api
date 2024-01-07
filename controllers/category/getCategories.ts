import { Subdomain } from '@hicagni/very-types/types/subdomain';
import { Request, Response } from 'express';
import { Category } from '@hicagni/very-types/types/companies/category';

import { redisClient } from '../../config/redis';
import { db } from '../../config/firebase';

interface ParseSubdomain extends Subdomain {
  pathRef: string;
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const redis = await redisClient();
    const storageCategory = await redis.get(`categories-${req.params.storeName}`);

    if (storageCategory) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(storageCategory),
      });
    }

    const storageDomain = (await redis.get(
      `domain-${req.params.storeName}`
    )) as string;
    let subdomain: ParseSubdomain = JSON.parse(storageDomain);
    const snap = await db.collection(subdomain.pathRef + '/categorias').get();
    const data = snap.docs
      .map((doc) => doc.data() as Category)
      .filter((category) => category.status)
      .map((category) => ({
        id: category.id,
        name: category.name,
      }));

    await redis.set(`categories-${req.params.storeName}`, JSON.stringify(data));

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'internal error',
    });
  }
};
