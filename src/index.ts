import cors from 'cors';
import express, { Router } from 'express';
import { createYoga } from 'graphql-yoga';
import env from '~/config/env';
import { schema } from '~/graphql';
import { connectDatabase } from '~/model';

import { router as actionRouter } from '~/apis/actions';
import { router as cronRouter } from '~/apis/cronjobs';
import { router as eventRouter } from '~/apis/events';
import { router as middlewareRouter } from '~/apis/middleware';

function initialServer() {
  // Initialize the graphql-yoga app
  const yoga = createYoga({
    schema,
    cors: {
      origin: '*',
      credentials: true,
      methods: ['POST'],
    },
  });
  const yogaRouter = Router();
  yogaRouter.use(yoga);

  const app = express();
  app.use(express.json());
  app.use(cors());
  // Define route endpoint
  app.use(yoga.graphqlEndpoint, yogaRouter);
  app.use('/verify', middlewareRouter);
  app.use('/actions', actionRouter);
  app.use('/events', eventRouter);
  app.use('/cronjobs', cronRouter);

  app.listen(env.PORT, () => {
    console.log(`🚀  App listening on port ${env.PORT}`);
  });
}

connectDatabase()
  .then(() => console.info('🧷 PostgreSQL Connected!'))
  .then(() => initialServer())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
