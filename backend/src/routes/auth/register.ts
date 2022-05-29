import { RouteInitializer } from "..";
import { isObjectWithKeys } from "../../utils/guards";
import { withPrefix } from "../../utils/routes";


const routes: RouteInitializer = (prefix, {app}) => {
  app.post(withPrefix(prefix, '/register'), (req, res) => {
    const requestBody = req.body;


  })
}
