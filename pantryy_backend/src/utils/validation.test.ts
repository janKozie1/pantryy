import { isEmail } from './validation.js'

describe('validation', () => {
  describe('isEmail', () => {
    it('correctly detects emails', () => {
      expect(isEmail('a@d.com')).toBe(true);
      expect(isEmail('a1@xyzd.com')).toBe(true);
      expect(isEmail('123@123.com')).toBe(true);
    })
    it('correctly detects non-email', () => {
      expect(isEmail('@d.com')).toBe(false);
      expect(isEmail('.com')).toBe(false);
      expect(isEmail('asdf.com')).toBe(false);
    })
  })
})
