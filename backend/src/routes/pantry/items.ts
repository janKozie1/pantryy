import { RouteInitializer } from "../index.js";
import { withPrefix } from "../../utils/routes.js";
import protectedRoute from "../../middleware/protectedRoute.js";

const routes: RouteInitializer = (prefix, {app, services},) => {
  app.get(withPrefix(prefix, ''), protectedRoute({services}), async (req, res) => {
    res.send("OK")
  })
}

export default routes;
