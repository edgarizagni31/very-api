import { Product } from '@hicagni/very-types/types/companies/product';
import { Topping } from '@hicagni/very-types/types/companies/topping';
import { db } from '../../config/firebase';

const toppings: Topping[] = [];

export const toApiJson = async (product: Product) => {
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

        toppings.length = 0;
        
        return {
          id: productType.id,
          name: productType.name || '',
          price: productType.price,
          toppings: listTopping,
        };
      }

      return {
        id: productType.id,
        name: productType.name || '',
        price: productType.price,
        toppings: null,
      };
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
