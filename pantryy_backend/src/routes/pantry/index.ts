import { RouteInitializer } from "../index.js";
import { withPrefix } from "../../utils/routes.js";

import items from './items.js';
import item from './item.js';
import measurmentUnits from './measurmentUnits.js';


const routes: RouteInitializer = (prefix, config) => {
  items(withPrefix(prefix, '/items'), config);
  item(withPrefix(prefix, '/item'), config);
  measurmentUnits(withPrefix(prefix, '/measurmentUnits'), config);
}

export default routes;
