import express from 'express';
import morgan from 'morgan';
import coors from 'cors';
import * as dotenv from 'dotenv';

import router from './routes';
import { setCache } from './middlewares/setCache';

const app = express();

dotenv.config();

app.use(coors());
app.use(morgan('dev'));
//app.use(setCache);
app.set('subdomain offset', 1);
app.set('port', process.env.PORT || '8080');
app.use(express.json());
app.use('/api/v1', router);

app.listen(app.get('port'), () => {
  console.log(`server on port http://localhost:${app.get('port')}`);
});
