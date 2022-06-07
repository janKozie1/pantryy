import { generatePath } from './routes'

describe('routes', () => {
  describe('generatePath', () => {
    it('parametrizes routes', () => {
      expect(generatePath('/asdf/:asdf/asdf', { asdf: '1'})).toBe('/asdf/1/asdf');
      expect(generatePath('/:id', { id: '1'})).toBe('/1');
      expect(generatePath('/a:a', {})).toBe('/a:a');
      expect(generatePath('/ffff', {})).toBe('/ffff');
    })
  })
})
