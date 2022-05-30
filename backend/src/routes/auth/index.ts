import { RouteInitializer } from "..";
import { withPrefix } from "../../utils/routes";

import login from './login';
import register from './register';

const routes: RouteInitializer = (prefix, config) => {
  login(withPrefix(prefix, '/login'), config);
  register(withPrefix(prefix, '/register'), config)
}

export default routes;
