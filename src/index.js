import express from 'express';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import restRoutes from './restRoutes.js';
import { error, success } from './utils/responseApi.js';

import { schemaWithDirectives } from './graphql/executableSchema.js';
import prisma from './utils/context.js';

import packageJson from '../package.json' assert { type: 'json' };

const { PORT = 3001 } = process.env;

const app = express();

// setup the logger middleware
app.use(morgan('tiny'));

app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/mrb/assets', express.static('mrb/assets', { fallthrough: false }));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'OriCloud API',
      version: '1.1.0',
      description:
        'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/index.js', './src/modules/**/*.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
console.log(swaggerDocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

app.get('/mrb*', (req, res) => {
  res.sendFile(path.join('mrb', 'index.html'), { root: '.' });
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
  schema: schemaWithDirectives,
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
app.use(
  '/graphql',
  expressMiddleware(gplServer, {
    context: ({ req }) => {
      // context setup as before
      const token = (req.headers.authorization || '').replace(/^Bearer\s/, '');

      return {
        prisma: prisma,
        activationUrl:
          req.headers['x-oricloud-app-activate-user-url'] || 'localhost',
        token: token,
      };
    },
  }),
);

// API ENDPOINTS
app.use(restRoutes);

// Get API version number
app.get('/version', (req, res) => {
  return res.status(200).json(success(`Version: ${packageJson.version}`));
});

// 404 - not found handling
app.use((req, res) => {
  return res.status(404).json(error('404: Not found.', res.statusCode));
});

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api
🔢 Running version: ${packageJson.version}`),
);
