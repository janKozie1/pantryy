import { PoolClient } from "pg";
import bcrypt from 'bcrypt';
import { RouteInitializer } from "..";
import { isEmpty, isNil, isObjectWithKeys } from "../../utils/guards";
import { withPrefix } from "../../utils/routes";
import { ValidationResponse } from "../../utils/types";
import { errorMessages, isEmail } from "../../utils/validation";
import { id } from "../../utils/fn";

type RegisterPayload = Readonly<{
  email: string;
  password: string;
  repeatedPassword: string;
}>

type RegisterResponse = ValidationResponse<RegisterPayload>

const validateBody = async (client: PoolClient, body: unknown): Promise<RegisterResponse> => {
  if (!isObjectWithKeys(body, ['email', 'password', 'repeatedPassword'])) {
    return {
      ok: false,
      validData: null,
      errors: {
        email: errorMessages.NOT_EMPTY,
        password: errorMessages.NOT_EMPTY,
        repeatedPassword: errorMessages.NOT_EMPTY,
      }
    }
  }

  const { email, password, repeatedPassword } = body;

  if (isEmpty(email) || isEmpty(password) || isEmpty(repeatedPassword)) {
    return {
      ok: false,
      validData: null,
      errors: {
        email: isEmpty(email) ? errorMessages.NOT_EMPTY : null,
        password: isEmpty(password) ? errorMessages.NOT_EMPTY : null,
        repeatedPassword: isEmpty(repeatedPassword) ? errorMessages.NOT_EMPTY : null,
      }
    }
  }

  if (!isEmail(email)) {
    return {
      ok: false,
      validData: null,
      errors: {
        email: errorMessages.VALID_EMAIL,
        password: null,
        repeatedPassword: null,
      }
    }
  }

  if (password !== repeatedPassword) {
    return {
      ok: false,
      validData: null,
      errors: {
        email: null,
        password: null,
        repeatedPassword: errorMessages.PASSWORDS_DONT_MATCH,
      }
    }
  }


  const emailInUse = (await client.query('SELECT user_id FROM users where user_email = $1', [email]))
    .rowCount !== 0;

  if (emailInUse) {
    return {
      ok: true,
      validData: null,
      errors: {
        email: errorMessages.EMAIL_TAKEN,
        password: null,
        repeatedPassword: null,
      }
    }
  }

  return {
    ok: true,
    validData: { email, password, repeatedPassword },
    errors: {}
  }
}

const createUser = async (client: PoolClient, payload: RegisterPayload): Promise<boolean> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(payload.password, salt);

  const result = await client.query("INSERT INTO users (user_email, user_password) VALUES ($1, $2)", [payload.email, hashedPassword]);
  return result.rowCount === 1;
}

const routes: RouteInitializer = (prefix, {app, pool, services}) => {
  app.post(withPrefix(prefix, ''), async (req, res) => {
    const client = await pool.connect();
    const parsed = await validateBody(client, req.body);

    if (!parsed.ok || isNil(parsed.validData)) {
      return res.json(parsed)
    }

    const didAdd = await createUser(client, parsed.validData);

    if (didAdd) {
      services.auth.login({
        email: parsed.validData.email,
        response: res,
      })
    }

    res.json(id<RegisterResponse>({
      ok: didAdd,
      validData: null,
      errors: {}
    }));
  })
}

export default routes;
