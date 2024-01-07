import { Request, Response } from 'express';
import { redisClient } from '../../config/redis';

export const updateStore = async (req: Request, res: Response) => {
  try {
    const redis = await redisClient();

    redis.del(`store-${req.params.storeName}`);
    redis.del('stores');

    return res.status(200).json({ success: true, message: 'clean cache' });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'internal error',
    });
  }
};
