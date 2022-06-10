import { Response } from 'express';

const makeMockResponse = (): Response => {
  const jsonFN = jest.fn();

  return {
    code: null,
    json: jsonFN
  } as unknown as  Response;
}

export default makeMockResponse;
