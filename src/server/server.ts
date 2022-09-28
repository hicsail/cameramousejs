let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
const createError = require("http-errors");
const PORT = 3001;

const TAG = "server.ts: ";

import { router as mouseCommandsRoute } from "./routes/mouseCommands.routes";

const MOUSE_PATH = "/mouse";

function startServer() {
  // start server
  const app = express();
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(cors());
  app.use(MOUSE_PATH, mouseCommandsRoute);

  const server = app.listen(PORT, () => {
    console.log(TAG, "Server listening at port " + PORT);
  });

  // handle server errors
  app.use((req: any, res: any, next: any) => {
    next(createError(404));
  });

  app.use(function (err: any, req: any, res: any, next: any) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
  });

  return { app: app, server: server };
}
export { startServer };
