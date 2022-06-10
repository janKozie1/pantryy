import { Pool, PoolClient, QueryArrayResult } from 'pg';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import auth from './auth.js';
import { Nullable } from '../utils/types.js';
import makeMockPool from '../mocks/pool.js';
import makeMockRequest from '../mocks/request.js';

describe('auth', () => {
  const pool = makeMockPool([]);

  const authCookieName = 'auth';
  const jwtKey = 'jwt_key';

  const service = auth({
    pool,
  }, {
    authCookieName,
    jwt: {
      expiresInSeconds: 100,
      key: jwtKey,
    },
  });

  describe('getToken', () => {
    it('gets a token from request', () => {
      expect(service.getToken(makeMockRequest({
        cookies: {
          [authCookieName]: 'token',
        }
      }))).toBe('token');

      expect(service.getToken(makeMockRequest({}))).toBe(undefined);
    });
  });

  describe('decodeToken', () => {
    it('correctly ignores invalid tokens', () => {
      expect(service.decodeToken('')).toBe(null);
      expect(service.decodeToken('123')).toBe(null);
      expect(service.decodeToken(jwt.sign({ invalidObj: '' }, jwtKey))).toBe(null);
      expect(service.decodeToken(jwt.sign({ email: 'asdf' }, jwtKey))).toBe(null);
    });

    it('gets email out of the token', () => {
      expect(service.decodeToken(jwt.sign({ email: 'test@gmail.com' }, jwtKey))).toEqual({ email: 'test@gmail.com' });
    });
  });

  describe('isLoggedIn', () => {
    it('determines if token is valid correctly', () => {
      expect(service.isLoggedIn(jwt.sign({ email: 'asdf' }, jwtKey))).toBe(false);
      expect(service.isLoggedIn(jwt.sign({ email: 'test@gmail.com' }, jwtKey))).toBe(true);
      expect(service.isLoggedIn(jwt.sign({ email: 'test@gmail.com' }, 'different key'))).toBe(false);
    });
  });

  describe('login', () => {
    it('adds a cookie to the response', () => {
      let name: Nullable<string> = null;
      let token: Nullable<string> = null;

      service.login({
        email: 'test@gmail.com',
        response: {
          cookie: (...args: Parameters<Response['cookie']>) => {
            [name, token] = args;

            return '';
          },
        } as unknown as Response,
      });

      expect(name).toBe(authCookieName);
      expect(service.decodeToken(token)).toEqual({ email: 'test@gmail.com' });
    });
  });
});
