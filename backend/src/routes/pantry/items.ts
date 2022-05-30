
import { RouteInitializer } from "..";
import { withPrefix } from "../../utils/routes";
import protectedRoute from "../../middleware/protectedRoute";

const routes: RouteInitializer = (prefix, {app, services},) => {
  app.get(withPrefix(prefix, ''), protectedRoute({services}), async (req, res) => {
    res.send("OK")
  })
}

export default routes;
