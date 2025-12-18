const jsonServer = require('json-server');
const auth = require('json-server-auth');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Bind the router db to the app
server.db = router.db;

server.use(middlewares);
server.use(auth);
server.use(router);

server.listen(4000, '0.0.0.0', () => {
  console.log('JSON Server is running on port 4000');
});
