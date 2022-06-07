import { capitalize } from "./string";

describe('string', () => {
  describe('capitalize', () => {
    it('correctly capitalizes string', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize('a')).toBe('A');
      expect(capitalize('asdgsdf')).toBe('Asdgsdf');
      expect(capitalize('1')).toBe('1');
      expect(capitalize('XyZ')).toBe('XyZ');
    })
  })
})
