import { Store } from '@hicagni/very-types/types/companies/store';

export const toApiJson = (store: Store) => {
  return {
    id: store.id,
    abierto: store.abierto,
    address: store.address.address,
    banner: store.banner,
    logo: store.logo,
    name: store.nombre,
    phone: store.phone,
    score: store.score,
  };
};
