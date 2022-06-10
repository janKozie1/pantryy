import makeMockApp from '../../mocks/app.js';
import makeMockPool from '../../mocks/pool.js';
import makeMockRequest from '../../mocks/request.js';
import makeMockResponse from '../../mocks/response.js';
import makeMockServices from '../../mocks/services.js';
import makeMockUpload from '../../mocks/upload.js';
import { errorMessages } from '../../utils/validation.js';

import register from './register.js';

describe('/register', () => {
  describe('POST', () => {
    it('validates and creates new users', async () => {
      const [routes, app] = makeMockApp();
      const pool = makeMockPool([
        [],
        [{userId: 'ok'}],
      ]);
      const upload = makeMockUpload();
      const services = makeMockServices({});

      const request = makeMockRequest({
        body: {
          email: 'test@gmail.com',
          password: '123',
          repeatedPassword: '123',
        }
      });
      const response = makeMockResponse();

      register('/', {
        app,
        pool,
        upload,
        services,
      });

      expect('/' in routes.post).toBe(true);
      await routes.post['/'](request, response);

      expect(response.json).toHaveBeenCalledWith({
        errors: { },
        ok: true,
        validData: null,
      });
    });

    it('blocks creating new users with the same email', async () => {
      const [routes, app] = makeMockApp();
      const pool = makeMockPool([
        [{ user_id: 'id' }],
      ]);
      const upload = makeMockUpload();
      const services = makeMockServices({});

      const request = makeMockRequest({
        body: {
          email: 'test@gmail.com',
          password: '123',
          repeatedPassword: '123',
        }
      });
      const response = makeMockResponse();

      register('/', {
        app,
        pool,
        upload,
        services,
      });

      expect('/' in routes.post).toBe(true);
      await routes.post['/'](request, response);

      expect(response.json).toHaveBeenCalledWith({
        errors: {
          email: errorMessages.EMAIL_TAKEN,
          password: null,
          repeatedPassword: null,
        },
        ok: false,
        validData: null,
      });
    });
  });
});
