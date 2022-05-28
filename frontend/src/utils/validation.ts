import { isString } from "./guards";

export const isEmail = (arg: unknown) => isString(arg) && /^[\w\d]+@[\w\d]+\.[\w\d]+/.test(arg);
