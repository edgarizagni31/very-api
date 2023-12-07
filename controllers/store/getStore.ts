import { Request, Response } from 'express';
import { Subdomain } from '@hicagni/very-types/types/subdomain';
import { Store } from '@hicagni/very-types/types/companies/store';

import { redisClient } from '../../config/redis';
import { db } from '../../config/firebase';
import { toApiJson } from './toApiJson';

interface ParseSubdomain extends Subdomain {
  pathRef: string;
}

export async function getStore(req: Request, res: Response) {
  try {
    const redis = await redisClient();
    const storageStore = await redis.get(`store-${req.params.storeName}`);

    if (storageStore) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(storageStore),
      });
    }

    const storageDomain = (await redis.get(
      `domain-${req.params.storeName}`
    )) as string;
    let subdomain: ParseSubdomain = JSON.parse(storageDomain);
    const snap = await db.doc(subdomain.pathRef).get();
    const data = snap.data() as Store;
    const resolveData = toApiJson(data);

    await redis.set(
      `store-${req.params.storeName}`,
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
      message: 'internal error',
    });
  }
}
