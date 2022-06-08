import { Middleware } from './index.js';

const protectedRoute: Middleware = ({ services }) => (req, res, next) => {
  if (services.auth.isLoggedIn(services.auth.getToken(req))) {
    return next();
  }
  res.statusCode = 401;
  res.json({
    ok: false,
  });
};

export default protectedRoute;
