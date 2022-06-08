import { RouteInitializer } from '../index.js';
import { withPrefix } from '../../utils/routes.js';
import protectedRoute from '../../middleware/protectedRoute.js';
import { id } from '../../utils/fn.js';

type MeasurmentUnitsResponse = Readonly<{
  data: Readonly<{
    id: string;
    name: string;
  }>[]
}>

const routes: RouteInitializer = (prefix, { app, services, pool }) => {
  app.get(withPrefix(prefix, ''), protectedRoute({ services }), async (req, res) => {
    const client = await pool.connect();
    const result = await client.query('SELECT measurment_unit_id, measurment_unit_name from measurment_units');

    client.release();

    res.json(id<MeasurmentUnitsResponse>({
      data: result.rows.map((row) => ({
        id: row.measurment_unit_id,
        name: row.measurment_unit_name,
      })),
    }));
  });
};

export default routes;
