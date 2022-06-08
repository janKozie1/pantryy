import { Pool, PoolClient } from 'pg';

export const id = <T>(arg: T) => arg;

export const withClient = <T extends unknown[], U>(fn: (arg1: PoolClient, ...args: T) => U, pool: Pool) => async (...args: T) => {
  const client = await pool.connect();
  const returnValue = fn(client, ...args);

  client.release();

  return returnValue;
};
