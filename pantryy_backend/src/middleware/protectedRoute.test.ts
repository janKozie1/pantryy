import { Services } from '../services/index.js'
import { Request, Response, NextFunction } from 'express';
import protectedRoute from './protectedRoute.js'
import makeMockRequest from '../mocks/request.js';
import makeMockServices from '../mocks/services.js';
import makeMockResponse from '../mocks/response.js';

describe('protectedRoute', () => {
  it('stops requests if unauthorized', () => {
    const request = makeMockRequest({});
    const services = makeMockServices({});
    const response = makeMockResponse();

    const next: NextFunction = () => null;

    protectedRoute({
      services,
    })(request, response, next);

    expect(response.statusCode).toBe(401);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ok: false}))
  })
})
