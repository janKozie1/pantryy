import {
  isEmpty,
  isLiteral,
  isNil,
  isString,
} from './guards';

describe('guards', () => {
  describe('isEmpty', () => {
    it('correctly detects empty values', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('                           ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    })
    it('correctly detect non-empty values', () => {
      expect(isEmpty('a')).toBe(false);
      expect(isEmpty('           a                ')).toBe(false);
      expect(isEmpty([null])).toBe(false);
      expect(isEmpty({a: 1})).toBe(false);
      expect(isEmpty(new Date('2020-12-12'))).toBe(false);
      expect(isEmpty(Infinity)).toBe(false);
    })
  })
  describe('isLiteral', () => {
    it('correctly detect literals', () => {
      expect(isLiteral({a: {c: 1}})).toBe(true);
      expect(isLiteral({a : null})).toBe(true);
      expect(isLiteral({asdf: 1})).toBe(true);
      expect(isLiteral({})).toBe(true);
      expect(isLiteral(new Object())).toBe(true);
    })
    it('correctly detects non-literals', () => {
      expect(isLiteral(new Date())).toBe(false);
      expect(isLiteral(1)).toBe(false);
      expect(isLiteral('')).toBe(false);
      expect(isLiteral(null)).toBe(false);
      expect(isLiteral(undefined)).toBe(false);
    })
  })
  describe('isNil', () => {
    it('correctly detects nil values', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
    })
    it('correctly detects non-nil values', () => {
      expect(isNil(1)).toBe(false);
      expect(isNil('')).toBe(false);
      expect(isNil(new Date())).toBe(false);
      expect(isNil(false)).toBe(false);
      expect(isNil({})).toBe(false);
    })
  })
  describe('isString', () => {
    it('correctly detects strings', () => {
      expect(isString('')).toBe(true);
      expect(isString(' 12 312')).toBe(true);
      expect(isString('12')).toBe(true);
      expect(isString('     ')).toBe(true);
      expect(isString(``)).toBe(true);
      expect(isString("")).toBe(true);
    })
    it('correctly detects non-strings', () => {
      expect(isString(1)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(new Date())).toBe(false);
      expect(isString(false)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
    })
  })
})
