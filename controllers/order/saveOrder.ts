import { Request, Response } from 'express';
import { redisClient } from '../../config/redis';
import { Subdomain } from '@hicagni/very-types/types/subdomain';
import { db } from '../../config/firebase';

interface ParseSubdomain extends Subdomain {
  pathRef: string;
}

export const saveOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const redis = await redisClient();
    const storageDomain = (await redis.get(
      `domain-${req.params.storeName}`
    )) as string;
    let subdomain: ParseSubdomain = JSON.parse(storageDomain);
    const docRef = db.collection(subdomain.pathRef + `/very-menu`).doc();

    await docRef.set({ id: docRef.id, ...data });

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ data: error, success: false });
  }
};
