import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { Pool  } from 'pg';

dotenv.config();
const app: Express = express();

app.get('/api', (req: Request, res: Response) => {
  const pool = new Pool();
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
  })
  res.send('Express + TypeScript Server');
});

app.listen(process.env.PORT, () => {
  console.log(`⚡️[server]: Server is running`);
});
