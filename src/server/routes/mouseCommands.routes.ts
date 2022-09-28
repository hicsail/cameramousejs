import { Router } from "express";
import { click, moveTo } from "../../controlApis/mouseCommands";

let router = Router();
const { handleUnknownError } = require("../utils");
const MOVEMENT_PATH = "/moveto";
const ACTION_PATH = "/action";

router.route(MOVEMENT_PATH).post(async (req, res) => {
  try {
    console.log("received movement command", req.body);
    if (req.body.x && req.body.y) {
      moveTo(req.body);
    }
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
});

// move mouse to position
router.route(ACTION_PATH).post(async (req: any, res: any) => {
  try {
    console.log("received action command", req.body);
    if (req.body.action) {
      click(req.body.action == "leftClick" ? "left" : "right");
    }
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
});

export { router };
