import { RouteInitializer } from "..";
import { withPrefix } from "../../utils/routes";
import protectedRoute from "../../middleware/protectedRoute";
import { id } from "../../utils/fn";

type MeasurmentUnitsResponse = Readonly<{
  data: Readonly<{
    id: string;
    name: string;
  }>[]
}>

const routes: RouteInitializer = (prefix, {app, services, pool},) => {
  app.get(withPrefix(prefix, ''), protectedRoute({services}), async (req, res) => {
    const client = await pool.connect();
    const result = await client.query('SELECT measurment_unit_id, measurment_unit_name from measurment_units');

    res.json(id<MeasurmentUnitsResponse>({
      data: result.rows.map((row) => ({
        id: row.measurment_unit_id,
        name: row.measurment_unit_name,
      }))
    }))
  })
}

export default routes;
