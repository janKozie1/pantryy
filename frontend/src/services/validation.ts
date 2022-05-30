import type { MakeServiceFN, ServiceCreator } from ".";
import { errorMessages } from "../utils/validation";
import { isEmpty, isNotNil } from "../utils/guards";
import type { Nullable } from "../utils/types";
import { isEmail } from "../utils/validation";

type ValidationResult<T, ValidFields extends T> = Readonly<{
  isValid: boolean;
  validFields: Nullable<ValidFields>;
  errors: Partial<Readonly<{
    [key in keyof T]: string;
  }>>
}>

type LoginFormData = Readonly<{
  email: unknown;
  password: unknown;
}>

type LoginFormValidData = Readonly<{
  [key in keyof LoginFormData]: string;
}>


const hasErrors = (obj: Partial<Record<string, Nullable<string>>>): boolean => Object.values(obj).some(isNotNil);

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

type ValidationService = Readonly<{
  validateLoginFields: ReturnType<typeof makeValidateLoginFields>;
}>

const makeValidationService: ServiceCreator<ValidationService> = (config, serviceConfig) => ({
  validateLoginFields: makeValidateLoginFields(config, serviceConfig),
})

export default makeValidationService;
