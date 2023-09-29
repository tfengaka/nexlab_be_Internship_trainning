import cors from 'cors';
import express, { Router } from 'express';
import { createYoga } from 'graphql-yoga';

import env from '~/config/env';
import { schema } from '~/graphql';
import { router as actionRouter } from '~/apis/actions';
import { router as middlewareRouter } from '~/apis/middleware';
import { connectDatabase } from '~/model';

function initialServer() {
  const app = express();

  // Initialize the graphql-yoga router
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

  app.use(express.json());
  app.use(cors());
  app.use(yoga.graphqlEndpoint, yogaRouter);
  app.use('/verify', middlewareRouter);
  app.use('/actions', actionRouter);

  app.listen(env.PORT, () => {
    console.log(`🚀  App listening on port ${env.PORT}`);
    console.log(`🚀  Yoga Playground are running at http://127.0.0.1:${env.PORT}/graphql\n`);
  });
}

connectDatabase()
  .then(() => console.info('🧷 PostgreSQL Connected!'))
  .then(() => initialServer())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
