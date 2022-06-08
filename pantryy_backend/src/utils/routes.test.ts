import { withPrefix } from './routes.js';

describe('routes', () => {
  describe('withPrefix', () => {
    it('generates output correctly', () => {
      expect(withPrefix('/root', '/:id')).toBe('/root/:id');
      expect(withPrefix('/root/', '/:id')).toBe('/root/:id');
      expect(withPrefix('/root/sub_root', '/:id')).toBe('/root/sub_root/:id');
    });
  });
});
