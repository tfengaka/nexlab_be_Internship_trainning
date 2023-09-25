import express, { Router } from 'express';
import { createYoga } from 'graphql-yoga';

import env from '~/config/env';
import schema from '~/schema';
import { connectDatabase } from './model';

function initialServer() {
  const app = express();

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

  app.use(yoga.graphqlEndpoint, yogaRouter);

  app.listen(env.PORT, () => {
    console.log(`\n🚀 GraphQL API server is running at http://localhost:${env.PORT}/graphql\n`);
  });
}

connectDatabase()
  .then(() => console.info('🧷 PostgreSQL Connected!'))
  .then(() => initialServer())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
