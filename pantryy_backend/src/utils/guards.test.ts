import {
  isEmpty,
  isLiteral,
  isNil,
  isString,
  isObjectWithKeys,
  isObjectWithPartialKeys,
} from './guards.js';
import { Literal } from './types.js';

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

  describe('isObjectWithKeys', () => {
    it('requires all object keys to be present', () => {
      expect(isObjectWithKeys({a: 1, b: 2}, ['a', 'b', 'c'])).toBe(false)
      expect(isObjectWithKeys({a: 1, b: 2}, ['a', 'b'])).toBe(true)
    })

    it('requires arg to be a literal', () => {
      const fn = () => 1;
      fn.x = 2;

      const obj: Literal = {}
      obj.x = 2;

      expect(isObjectWithKeys(fn, ['x'])).toBe(false);
      expect(isObjectWithKeys(obj, ['x'])).toBe(true);
    })

    it('doesnt care about the order of keys', () => {
      expect(isObjectWithKeys({a: 1, b: 2}, ['b', 'a'])).toBe(true);
      expect(isObjectWithKeys({a: 1, c: 3, b: 2}, ['c', 'b', 'a'])).toBe(true);
    })

    it('doesnt throw on null or undefined', () => {
      expect(isObjectWithKeys(null, ['asdf', 'f'])).toBe(false);
      expect(isObjectWithKeys(undefined, ['asdf', 'f'])).toBe(false);
    })
  })

  describe('isObjectWithPartialKeys', () => {
    it('requires some object keys to be present', () => {
      expect(isObjectWithPartialKeys({a: 1, b: 2}, ['a', 'b', 'c'])).toBe(true)
      expect(isObjectWithPartialKeys({a: 1, b: 2}, ['a', 'b'])).toBe(true)
    });

    it('accepts object with extra keys', () => {
      expect(isObjectWithPartialKeys({a: 1, b: 2, d: 3, e: 4}, ['a', 'b', 'c'])).toBe(true)
    })
  })
})
