"use strict";

var _express = _interopRequireDefault(require("express"));
var _expressValidator = require("express-validator");
var _cors = _interopRequireDefault(require("cors"));
var _server = require("@apollo/server");
var _express2 = require("@apollo/server/express4");
var _helmet = _interopRequireDefault(require("helmet"));
var _unSecureRoutes = _interopRequireDefault(require("./unSecureRoutes.js"));
var _responseApi = require("./utils/responseApi.js");
var _executableSchema = require("./graphql/executableSchema.js");
var _context = _interopRequireDefault(require("./utils/context.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  PORT = 3001
} = process.env;
const app = (0, _express.default)();
app.use((0, _helmet.default)());
app.use(_express.default.json());
app.use((0, _cors.default)());
app.use(_express.default.static('public'));

// API ENDPOINTS

// unsecured routes for login, registration, etc.
app.use(_unSecureRoutes.default);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/demoEvent', [(0, _expressValidator.check)('name').not().isEmpty().isString(), (0, _expressValidator.check)('date').not().isEmpty(), (0, _expressValidator.check)('location').not().isEmpty().isString(), (0, _expressValidator.check)('zeroTime').not().isEmpty(), (0, _expressValidator.check)('published').isBoolean(), (0, _expressValidator.check)('sportId').not().isEmpty().isNumeric(), (0, _expressValidator.check)('relay').isBoolean()], async (req, res) => {
  const errors = (0, _expressValidator.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }
  const {
    body: {
      name,
      date,
      location,
      zeroTime,
      published,
      sportId,
      relay
    }
  } = req;
  const dateTime = new Date(date);
  await _context.default.event.create({
    data: {
      name,
      date: dateTime,
      location,
      zeroTime: new Date(zeroTime),
      published,
      sportId,
      relay
    }
  });
  res.send('Hello World!');
});

// Set up Apollo Server
const gplServer = new _server.ApolloServer({
  schema: _executableSchema.schema,
  context: _context.default
});
await gplServer.start();
app.use('/graphql', (0, _express2.expressMiddleware)(gplServer));

// 404 - not found handling
app.use((req, res) => {
  return res.status(404).json((0, _responseApi.error)('404: Not found.', res.statusCode));
});
const server = app.listen(PORT, () => console.log(`
🚀 Server ready at: http://localhost:${PORT}
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api`));
