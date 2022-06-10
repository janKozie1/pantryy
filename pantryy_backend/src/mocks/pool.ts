import { Pool, PoolClient, QueryArrayResult } from 'pg';

type MockData = unknown[][]

const makeMockPool = (data: MockData): Pool => {
  let index = 0;

  const mockClient: PoolClient = {
    query: async (): Promise<QueryArrayResult> => {
      const dataUsed = data[index] ?? [];

      const result =  ({
        rowCount: dataUsed.length,
        rows: dataUsed,
        oid: index,
        command: '',
        fields: [],
      });

      index += 1;

      return result as QueryArrayResult;
    },
    release: async () => null,
  } as unknown as PoolClient;

  const mockPool: Pool = {
    connect: async () => mockClient,
  } as unknown as Pool;

  return mockPool;
};

export default makeMockPool;
