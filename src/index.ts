import cors from 'cors';
import express, { Router } from 'express';
import { createYoga } from 'graphql-yoga';
import env from '~/config/env';
import schema from '~/schema';
import { connectDatabase } from './model';

import { actionRouter } from './apis/actions/router';
import { authRouter } from './apis/auth/router';

function initialServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

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

  app.use('/verify', authRouter);
  app.use('/actions', actionRouter);

  app.listen(env.PORT, () => {
    console.log(`🚀  App listening on port ${env.PORT}\n`);
  });
}

connectDatabase()
  .then(() => console.info('🧷 PostgreSQL Connected!'))
  .then(() => initialServer())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
