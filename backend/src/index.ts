import express, { Express, Request, Response } from 'express';
import { Pool  } from 'pg';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool();
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/api', (req: Request, res: Response) => {
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
  })
  res.send('Express + TypeScript Server');
});

app.post('/api/login', (req, res) => {
  if (req.body.password === 'asdf') {
    res.cookie("auth", "asdf")
    return res.json({ok: true})
  }

  return res.json({ ok: false, errors: {
    email: "User doesnt exist",
    password: "Invalid password"
  }})
})

app.listen(process.env.PORT, () => {
  console.log(`⚡️[server]: Server is running`);
});
