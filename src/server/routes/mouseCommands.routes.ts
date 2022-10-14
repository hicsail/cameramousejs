import { Router } from "express";
import { configuration, TRACKING_STATUS } from "../../config/config";
import { click, moveTo } from "../../controlApis/mouseCommands";

let router = Router();
const { handleUnknownError } = require("../utils");
const MOVEMENT_PATH = "/moveto";
const ACTION_PATH = "/action";

// move mouse to position
router.route(MOVEMENT_PATH).post(async (req, res) => {
  try {
    console.log("received movement command", req.body);
    if (req.body.x && req.body.y) {
      if (configuration.trackingStatus == TRACKING_STATUS.ON) {
        moveTo(req.body);
      } else {
        console.log("tracking is turned off");
      }
    }
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
});

// perform mouse click
router.route(ACTION_PATH).post(async (req: any, res: any) => {
  try {
    console.log("received action command", req.body);
    if (req.body.action) {
      if (configuration.trackingStatus == TRACKING_STATUS.ON) {
        click(req.body.action == "leftClick" ? "left" : "right");
      } else {
        console.log("tracking is turned off");
      }
    }
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
});

export { router };
