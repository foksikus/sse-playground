import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import consola from 'consola';
import { AddressInfo } from 'net';
const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function* dataGenerator() {
  yield* [...Array(101).keys()];
}

app.get('/api/events', (req: Request, res: Response) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('event: message\n');
  res.write('data: Welcome!\n\n');
  const data = dataGenerator();

  const interval = setInterval(() => {
    const idk = data.next();
    if (idk.done) {
      clearInterval(interval);
      consola.success('Done!');
      res.end();
    } else {
      res.write('event: message\n');
      res.write(`data: ${idk.value}\n\n`);
    }
  }, 100);
});

const server = app.listen(9888, 'localhost', () => {
  const { address, port } = server.address() as AddressInfo;
  consola.success(`Example app listening at http://${address}:${port}`);
});
