import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { handler as authHandler } from './components/auth/Handler';
import { handler as propertyHandler } from './components/property/Handler';
import GlobalConfig from './config/GlobalConfig';
import {
  cacheMiddleware,
  errorHandler,
  optionsMiddleware,
} from './handler/Middlewares';
import './sequelize/Sequelize';
import { swaggerDocument } from './swagger';

export default () => initApp();

export function initApp({ port = GlobalConfig.PORT } = {}) {
  return new Promise(async (resolve) => {
    const app = express();

    app.disable('etag');

    app.use(helmet());
    app.get('/', (req, res) => res.status(200).send('ok'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(optionsMiddleware);
    app.use(cacheMiddleware);

    app.use('/api/v1/auth', authHandler());

    app.use('/api/v1/properties', propertyHandler());
    app.use(errorHandler);

    app.listen(port, '0.0.0.0', () => {
      console.log(`App listening on port %s`, port);
      resolve(app);
    });
  });
}
