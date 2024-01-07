import { Request, Response } from 'express';
import { redisClient } from '../../config/redis';

export const updateProducts = async (req: Request, res: Response) => {
  try {
    const redis = await redisClient();

    redis.del(`products-${req.params.storeName}`);

    return res.status(200).json({ success: true, message: 'clean cache' });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'internal error',
    });
  }
};
