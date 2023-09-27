import { Subdomain } from "@hicagni/very-types/types/subdomain";
import { redisClient } from "../config/redis";
import { db } from "../config/firebase";
import { Request, Response } from "express";
import { Product } from "@hicagni/very-types/types/companies/product";
import { Topping } from "@hicagni/very-types/types/companies/topping";

interface ParseSubdomain extends Subdomain {
  pathRef: string;
}

const toppings: Topping[] = [];

const toApiJson = async (product: Product) => {
  const taskProductTypes = product.tipos
    .filter((productType) => productType.status)
    .map(async (productType) => {
      let listTopping: Topping[] | null = null;

      if (productType.adicionales) {
        const taskToppings = productType.adicionales.map(async (topping) => {
          const storageTopping = toppings.find(
            (actualTopping) => actualTopping.id === topping.id
          );

          if (!storageTopping) {
            const snap = await db.doc(topping.reference.path).get();

            toppings.push(snap.data() as Topping);

            return snap.data() as Topping;
          }

          return storageTopping;
        });

        listTopping = await Promise.all(taskToppings);

        return {
          id: productType.id,
          name: productType.name,
          price: productType.price,
          toppings: listTopping,
        };
      }
    });
  const productTypes = await Promise.all(taskProductTypes);

  return {
    id: product.id,
    name: product.name,
    categoryId: product.categoria,
    description: product.descripcion,
    image: product.img,
    types: productTypes,
  };
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const redis = await redisClient();
    const storageDomain = (await redis.get(
      `domain-${req.subdomains[0]}`
    )) as string;
    let subdomain: ParseSubdomain = JSON.parse(storageDomain);
    const storageProducts = await redis.get(`products-${req.subdomains[0]}`);

    if (storageProducts) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(storageProducts),
      });
    }

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
      `products-${req.subdomains[0]}`,
      JSON.stringify(resolveData)
    );

    toppings.length = 0;

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
