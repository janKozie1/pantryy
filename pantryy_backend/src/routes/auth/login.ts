import { PoolClient } from "pg";
import bcrypt from 'bcrypt';

import { RouteInitializer } from "../index.js";
import { isEmpty, isNil, isObjectWithKeys } from "../../utils/guards.js";
import { withPrefix } from "../../utils/routes.js";
import { ValidationResponse } from "../../utils/types.js";
import { errorMessages, isEmail } from "../../utils/validation.js";
import { id, withClient } from "../../utils/fn.js";

type LoginPayload = Readonly<{
  email: string;
  password: string;
}>

type LoginResponse = ValidationResponse<LoginPayload>

const validateBody = async (client: PoolClient, body: unknown): Promise<LoginResponse> => {
  if (!isObjectWithKeys(body, ['email', 'password'])) {
    return {
      ok: false,
      validData: null,
      errors: {
        email: errorMessages.NOT_EMPTY,
        password: errorMessages.NOT_EMPTY,
      }
    }
  }

  const { email, password } = body;

  if (isEmpty(email) || isEmpty(password)) {
    return {
      ok: false,
      validData: null,
      errors: {
        email: isEmpty(email) ? errorMessages.NOT_EMPTY : null,
        password: isEmpty(password) ? errorMessages.NOT_EMPTY : null,
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
      }
    }
  }

  const userResponse = (await client.query('SELECT user_id, user_password FROM users where user_email = $1', [email]))

  if (isEmpty(userResponse.rows) || userResponse.rowCount !== 1) {
    return {
      ok: false,
      validData: null,
      errors: {
        email: errorMessages.EMAIL_NOT_USED,
        password: null,
      }
    }
  }

  const [user] = userResponse.rows;

  if (!bcrypt.compareSync(password, user.user_password)) {
    return {
      ok: false,
      validData: null,
      errors: {
        email: null,
        password: errorMessages.INVALID_PASSWORD,
      }
    }
  }

  return {
    ok: true,
    validData: { email, password  },
    errors: {}
  }
}

const routes: RouteInitializer = (prefix, {app, pool, services}) => {
  app.post(withPrefix(prefix, ''), async (req, res) => {
    const parsed = await withClient(validateBody, pool)(req.body);

    if (!parsed.ok || isNil(parsed.validData)) {
      return res.json(parsed)
    }

    services.auth.login({
      email: parsed.validData.email,
      response: res,
    })

    res.json(id<LoginResponse>({
      ok: true,
      validData: null,
      errors: {}
    }));
  })
}

export default routes;
