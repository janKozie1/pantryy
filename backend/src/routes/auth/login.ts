import { RouteInitializer } from '..';
import { withPrefix } from '../../utils/routes';

const routes: RouteInitializer = (prefix, {app}) => {
  console.log(withPrefix(prefix, '/'))
  app.post(withPrefix(prefix, ''), (req, res) => {
    if (req.body.password === 'asdf') {
      res.cookie("auth", "asdf")
      return res.json({ok: true})
    }

    return res.json({ ok: false, errors: {
      email: "User doesnt exist",
      password: "Invalid password"
    }})
  })
}

export default routes;
