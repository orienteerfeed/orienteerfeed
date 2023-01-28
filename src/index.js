import express from 'express';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import helmet from 'helmet';

import unSecureRoutes from './unSecureRoutes.js';
import { error } from './utils/responseApi.js';

import { schema } from './graphql/executableSchema.js';
import prisma from './utils/context.js';

const { PORT = 3001 } = process.env;

const app = express();

app.use(helmet());

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// API ENDPOINTS

// unsecured routes for login, registration, etc.
app.use(unSecureRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post(
  '/demoEvent',
  [
    check('name').not().isEmpty().isString(),
    check('date').not().isEmpty(),
    check('location').not().isEmpty().isString(),
    check('zeroTime').not().isEmpty(),
    check('published').isBoolean(),
    check('sportId').not().isEmpty().isNumeric(),
    check('relay').isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    const {
      body: { name, date, location, zeroTime, published, sportId, relay },
    } = req;
    const dateTime = new Date(date);
    await prisma.event.create({
      data: {
        name,
        date: dateTime,
        location,
        zeroTime: new Date(zeroTime),
        published,
        sportId,
        relay,
      },
    });
    res.send('Hello World!');
  },
);

// Set up Apollo Server
const gplServer = new ApolloServer({
  schema: schema,
  context: prisma,
});
await gplServer.start();

app.use('/graphql', expressMiddleware(gplServer));

// 404 - not found handling
app.use((req, res) => {
  return res.status(404).json(error('404: Not found.', res.statusCode));
});

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api`),
);
