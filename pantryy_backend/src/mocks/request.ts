import { Request } from 'express';
import { Literal } from '../utils/types.js';

type MakeMockRequestArg = Readonly<{
  cookies?: Literal;
  body?: Literal
}>

const makeMockRequest = ({cookies, body}: MakeMockRequestArg): Request => ({
  cookies: cookies ?? {},
  body: body ?? {},
}) as unknown as Request;

export default makeMockRequest;
