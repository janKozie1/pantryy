import { RouteInitializer } from "../index.js";
import { withPrefix } from "../../utils/routes.js";

import login from './login.js';
import register from './register.js';

const routes: RouteInitializer = (prefix, config) => {
  login(withPrefix(prefix, '/login'), config);
  register(withPrefix(prefix, '/register'), config)
}

export default routes;
