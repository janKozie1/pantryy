import { Middleware } from ".";
import { isNil } from "../utils/guards";

const protectedRoute: Middleware = ({services}) => (req, res, next) => {
  const authToken = req.cookies.auth;

  if (!isNil(authToken) && services.auth.isLoggedIn(authToken)) {
    return next()
  } else {
    res.statusCode = 401;
    res.json({
      ok: false
    })
  }
}

export default protectedRoute;
