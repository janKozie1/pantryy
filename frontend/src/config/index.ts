export const Routes = {
  login: '/login',
  register: '/register',
  pantry: '/pantry',
  product: '/pantry/:id',
  home: '/'
} as const;

export const ApiPrefix = '/api' as const;
export const ApiEndpoints = {
  login: '/auth/login',
  register: '/auth/register',
  getMeasurmentUnits: '/pantry/measurmentUnits',
  createPantryItem: '/pantry/item',
  getPantryItem: '/pantry/item/:id',
  getPantryItems: '/pantry/items',
} as const;
