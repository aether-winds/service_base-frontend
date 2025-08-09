import express from 'express';
import { join } from 'node:path';
import hbs from 'hbs';

const application = express();
application.set('view engine', 'hbs');
application.set('views', join(__dirname, 'views'));
application.engine('html', hbs.__express);
application.use('/assets', express.static(join(__dirname, 'assets')));
