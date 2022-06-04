import { RouteInitializer } from "..";
import { withPrefix } from "../../utils/routes";

import items from './items';
import item from './item';
import measurmentUnits from './measurmentUnits';


const routes: RouteInitializer = (prefix, config) => {
  items(withPrefix(prefix, '/items'), config);
  item(withPrefix(prefix, '/item'), config);
  measurmentUnits(withPrefix(prefix, '/measurmentUnits'), config);
}

export default routes;
