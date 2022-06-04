import type { MakeServiceFN, ServiceCreator } from ".";
import { errorMessages, isFile } from "../utils/validation";
import { isEmpty, isNil, isNotNil } from "../utils/guards";
import type { Nullable } from "../utils/types";
import { isEmail } from "../utils/validation";

type ValidationResult<T, ValidFields extends T> = Readonly<{
  isValid: boolean;
  validFields: Nullable<ValidFields>;
  errors: Partial<Readonly<{
    [key in keyof T]: string;
  }>>
}>

const hasErrors = (obj: Partial<Record<string, Nullable<string>>>): boolean => Object.values(obj).some(isNotNil);

type LoginFormData = Readonly<{
  email: unknown;
  password: unknown;
}>

type LoginFormValidData = Readonly<{
  [key in keyof LoginFormData]: string;
}>

const makeValidateLoginFields: MakeServiceFN<LoginFormData, ValidationResult<LoginFormData, LoginFormValidData>> = () => ({
  email,
  password
}) => {
  const errors: ValidationResult<LoginFormData, LoginFormValidData>['errors'] = {
    email: isEmpty(email)
      ? errorMessages.NOT_EMPTY
      : !isEmail(email)
        ? errorMessages.VALID_EMAIL
        : null,
    password: isEmpty(password)
      ? errorMessages.NOT_EMPTY
      : null,
  }

  const isValid = !hasErrors(errors);

  return {
    isValid,
    errors,
    validFields: isValid ? ({
      email,
      password
    } as LoginFormValidData) : null,
  }
}

type RegisterFormData = Readonly<{
  email: unknown;
  password: unknown;
  repeatedPassword: unknown;
}>

type RegisterFormValidData = Readonly<{
  [key in keyof RegisterFormData]: string;
}>

const makeValidateRegisterFields: MakeServiceFN<RegisterFormData, ValidationResult<RegisterFormData, RegisterFormValidData>> = () => ({
  email,
  password,
  repeatedPassword,
}) => {
  const errors: ValidationResult<RegisterFormData, RegisterFormValidData>['errors'] = {
    email: isEmpty(email)
      ? errorMessages.NOT_EMPTY
      : !isEmail(email)
        ? errorMessages.VALID_EMAIL
        : null,
    password: isEmpty(password)
      ? errorMessages.NOT_EMPTY
      : null,
    repeatedPassword: isEmpty(password)
      ? errorMessages.NOT_EMPTY
      : password !== repeatedPassword
        ? errorMessages.PASSWORDS_DONT_MATCH
        : null,
  }

  const isValid = !hasErrors(errors);

  return {
    isValid,
    errors,
    validFields: isValid ? ({
      email,
      password,
      repeatedPassword,
    } as RegisterFormValidData) : null,
  }
}

type AddPantryItemFormData = Readonly<{
  name: unknown;
  image: unknown;
  description: unknown;
  unit: unknown;
}>

type AddPantryItemValidData = Readonly<{
  [key in keyof Omit<AddPantryItemFormData, 'image'>]: string;
}> & Readonly<{
  image: File;
}>


const makeValidateAddPantryItemFields: MakeServiceFN<AddPantryItemFormData, ValidationResult<AddPantryItemFormData, AddPantryItemValidData>> = () => ({
  name,
  image,
  description,
  unit
}) => {
  const errors: ValidationResult<AddPantryItemFormData, AddPantryItemValidData>['errors'] = {
    name: isEmpty(name)
      ? errorMessages.NOT_EMPTY
      : null,
    image: !isFile(image)
      ? errorMessages.VALID_FILE
      : null,
    description: isEmpty(description)
      ? errorMessages.NOT_EMPTY
      : null,
    unit: isEmpty(unit)
      ? errorMessages.NOT_SELECTED
      : null
  }

  const isValid = !hasErrors(errors);

  return {
    isValid,
    errors,
    validFields: isValid ? ({
      name,
      image,
      description,
      unit
    } as AddPantryItemValidData) : null,
  }
}

type ValidationService = Readonly<{
  validateLoginFields: ReturnType<typeof makeValidateLoginFields>;
  validateRegisterFields: ReturnType<typeof makeValidateRegisterFields>
  validateAddPantryItemFields: ReturnType<typeof makeValidateAddPantryItemFields>
}>

const makeValidationService: ServiceCreator<ValidationService> = (config, serviceConfig) => ({
  validateLoginFields: makeValidateLoginFields(config, serviceConfig),
  validateRegisterFields: makeValidateRegisterFields(config, serviceConfig),
  validateAddPantryItemFields: makeValidateAddPantryItemFields(config, serviceConfig)
})

export default makeValidationService;
