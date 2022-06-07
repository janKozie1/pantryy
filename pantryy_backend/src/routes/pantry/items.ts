import { RouteInitializer } from "../index.js";
import { withPrefix } from "../../utils/routes.js";
import protectedRoute from "../../middleware/protectedRoute.js";
import { PoolClient } from "pg";
import { id, withClient } from "../../utils/fn.js";
import { Nullable } from "../../utils/types.js";
import { Services } from "../../services/index.js";

type Product = Readonly<{
  id: string;
  name: string;
  description: string;
  imageURL: string;
}>

type GetUserProductsResponse = Product[];

const getUserProducts = async (client: PoolClient, services: Services, email: Nullable<string>): Promise<GetUserProductsResponse> => {
  const user = await client.query('SELECT user_id from users where users.user_email = $1', [email]);
  const userId = user.rows[0].user_id;

  const products = await client.query('SELECT P.product_id, PD.product_name, PD.product_description, PD.product_image_url FROM products as P INNER JOIN products_details as PD ON PD.product_detail_id = P.product_detail_id where P.user_id = $1', [
    userId
  ])

  return products.rows.map((row) => ({
    id: row.product_id,
    name: row.product_name,
    imageURL: services.files.getImageURL(row.product_image_url),
    description: row.product_description,
  }));
}


const routes: RouteInitializer = (prefix, {app, services, pool},) => {
  app.get(withPrefix(prefix, ''), protectedRoute({services}), async (req, res) => {
    const products = await withClient(getUserProducts, pool)(
      services,
      services.auth.decodeToken(services.auth.getToken(req))?.email
    );

    return res.json(id<GetUserProductsResponse>(products))
  })
}

export default routes;
