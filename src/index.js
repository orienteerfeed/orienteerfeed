import express from 'express';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import unSecureRoutes from './unSecureRoutes.js';
import { error } from './utils/responseApi.js';

import { schema } from './graphql/executableSchema.js';
import prisma from './utils/context.js';

const { PORT = 3001 } = process.env;

const app = express();

// setup the logger middleware
app.use(morgan('tiny'));

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'OriCloud API',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    },
  },
  apis: ['./src/index.js', './src/modules/**/*.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
console.log(swaggerDocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API ENDPOINTS

// unsecured routes for login, registration, etc.
app.use(unSecureRoutes);

/**
 * @swagger
 * /:
 *  get:
 *    summary: Hello World! Test endpoint.
 *    description: Get hello world
 *    responses:
 *      200:
 *        description: Return page with string Hello World!
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post(
  '/demoEvent',
  [
    check('name').not().isEmpty().isString(),
    check('date').not().isEmpty(),
    check('organizer').not().isEmpty().isString(),
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
      body: {
        name,
        date,
        organizer,
        location,
        zeroTime,
        published,
        sportId,
        relay,
      },
    } = req;
    const dateTime = new Date(date);
    await prisma.event.create({
      data: {
        name,
        date: dateTime,
        organizer,
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

/**
 * @swagger
 * /graphql:
 *  get:
 *    summary: Play with Graphql in sandbox
 *    description: GraphQL Playground
 *    responses:
 *      200:
 *        description: Success
 */
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
