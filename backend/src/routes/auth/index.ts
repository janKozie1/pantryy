import { RouteInitializer } from "..";
import { withPrefix } from "../../utils/routes";

import login from './login';

const routes: RouteInitializer = (prefix, config) => {
  login(withPrefix(prefix, '/login'), config);
}

export default routes;
