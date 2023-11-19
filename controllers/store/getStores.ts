import { Subdomain } from '@hicagni/very-types/types/subdomain';
import { redisClient } from '../../config/redis';
import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { Store } from '@hicagni/very-types/types/companies/store';
import { toApiJson } from './toApiJson';

export async function getStores(req: Request, res: Response) {
  try {
    const redis = await redisClient();
    const storageStore = await redis.get(`stores`);

    if (storageStore) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(storageStore),
      });
    }

    const snap = await db.collection('subdomains').get();
    const subdomains = snap.docs.map((doc) => doc.data() as Subdomain);
    const tasksData = subdomains.map(async (subdomain) => {
      const snap = await db.doc(subdomain.ref.path).get();
      const store = snap.data() as Store;
      return toApiJson(store);
    });
    const resolveData = await Promise.all(tasksData);

    await redis.set(`stores`, JSON.stringify(resolveData));

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
