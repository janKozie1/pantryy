import { RouteInitializer } from "..";
import { withPrefix } from "../../utils/routes";

import items from './items';

const routes: RouteInitializer = (prefix, config) => {
  items(withPrefix(prefix, '/items'), config);
}

export default routes;
