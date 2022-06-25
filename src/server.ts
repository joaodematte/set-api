/* eslint-disable no-console */
import { env } from 'process';
import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();

const port = Number(env.PORT) || 5000;
const host = env.HOST;

if (env.ENVIRONMENT === 'dev') {
  app.use((req, res, next) => {
    const requestTime = new Date().toLocaleTimeString('pt-br');

    switch (req.method) {
      case 'GET':
        console.log(`\x1b[42m\x1b[30m[${requestTime} -- ${req.method}]:\x1b[0m ${req.path}`);
        break;
      case 'POST':
        console.log(`\x1b[44m\x1b[30m[${requestTime} -- ${req.method}]:\x1b[0m ${req.path}`);
        break;
      case 'DELETE':
        console.log(`\x1b[41m\x1b[30m[${requestTime} -- ${req.method}]:\x1b[0m ${req.path}`);
        break;
      case 'PUT':
        console.log(`\x1b[46m\x1b[30m[${requestTime} -- ${req.method}]:\x1b[0m ${req.path}`);
        break;
      default:
        console.log(`\x1b[47m\x1b[30m[${requestTime} -- ${req.method}]:\x1b[0m ${req.path}`);
        break;
    }

    next();
  });
}

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
  console.log(`✨ server is running at http://${host}:${port}`);
});
