import { isEmpty, isNil, isString } from "./guards";

export const isEmail = (arg: unknown): arg is string => isString(arg) && (
  /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/
).test(arg);

export const errorMessages = {
  NOT_EMPTY: 'Must not be empty',
  VALID_EMAIL: 'Must be a valid email',
  PASSWORDS_DONT_MATCH: 'Passwords must match',
  VALID_FILE: 'Must be a valid file',
  NOT_SELECTED: 'One of the options must be selected',
}

export const isFile = (arg: unknown): arg is File => !isNil(arg) && arg instanceof File;

export const isNotEmptyFile = (arg: unknown): arg is File =>  isFile(arg) && !isEmpty(arg.name) && arg.size !== 0;
export const isEmptyFile = (arg: unknown): arg is File => isFile(arg) && !isNotEmptyFile(arg);
