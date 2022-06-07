import { errorMessages } from '../utils/validation';
import validation from './validation'

describe('validation', () => {
  const fetchFn = jest.fn(() => Promise.resolve(null));
  const sendJSONFn = jest.fn(() => Promise.resolve(null));

  const service = validation({
    fetch: fetchFn,
    sendJSON: sendJSONFn,
  }, null)

  describe('validateRegisterFields', () => {
    it('validates correctly', () => {
      expect(service.validateRegisterFields({
        email: 'asdf',
        password: '123',
        repeatedPassword: '3'
      })).toEqual({
        isValid: false,
        validFields: null,
        errors:  {
          email: errorMessages.VALID_EMAIL,
          password: null,
          repeatedPassword: errorMessages.PASSWORDS_DONT_MATCH,
        },
      })

      expect(service.validateRegisterFields({
        email: 'asdf@gmail.com',
        password: '123',
        repeatedPassword: '123 '
      })).toEqual({
        isValid: false,
        validFields: null,
        errors:  {
          email: null,
          password: null,
          repeatedPassword: errorMessages.PASSWORDS_DONT_MATCH,
        },
      })

      expect(service.validateRegisterFields({
        email: 'asdf@gmail.com',
        password: '123',
        repeatedPassword: '123'
      })).toEqual({
        isValid: true,
        validFields: {
          email: 'asdf@gmail.com',
          password: '123',
          repeatedPassword: '123'
        },
        errors:  {
          email: null,
          password: null,
          repeatedPassword: null,
        },
      })
    })
  })

  describe('validateAddPantryItemFields', () => {
    it('validates correctly', () => {
      expect(service.validateAddPantryItemFields({
        description: 'asdf',
        image: '',
        name: null,
        unit: null,
      })).toEqual({
        isValid:false,
        validFields: null,
        errors:  {
          description: null,
          image: errorMessages.VALID_FILE,
          name: errorMessages.NOT_EMPTY,
          unit: errorMessages.NOT_SELECTED,
        },
      });

      expect(service.validateAddPantryItemFields({
        description: 'asdf',
        image: new File([], ''),
        name: 'asdf',
        unit: 'asdf',
      })).toEqual({
        isValid:false,
        validFields: null,
        errors:  {
          description: null,
          image: errorMessages.VALID_FILE,
          name: null,
          unit: null,
        },
      })


      const validFile = new File(['asdf'], 'text.txt')
      expect(service.validateAddPantryItemFields({
        description: 'asdf',
        image: validFile,
        name: 'asdf',
        unit: 'asdf',
      })).toEqual({
        isValid: true,
        validFields: {
          description: 'asdf',
          image: validFile,
          name: 'asdf',
          unit: 'asdf',
        },
        errors:  {
          description: null,
          image: null,
          name: null,
          unit: null,
        },
      })
    })
  })
})
