// server.js
require("dotenv").config();
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const initSocketServer = require("./socketServer");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = initSocketServer(server);

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
