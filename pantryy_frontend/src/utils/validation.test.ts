import { isEmail, isEmptyFile } from './validation'

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

  describe('isEmptyFile', () => {
    it('correctly detects empty files', () => {
      expect(isEmptyFile(new File([], ''))).toBe(true);
    })

    it('correctly detects non-empty files', () => {
      expect(isEmptyFile(null)).toBe(false);
      expect(isEmptyFile('asdf')).toBe(false);
      expect(isEmptyFile(new File(["foosdfgsdfgds"], 'foo.txt', { type: 'text/plain'}))).toBe(false);
    })
  })
})
