import { Router } from "express";
import { mainWindow } from "../../index";
import { configuration, TRACKING_STATUS } from "../../config/config";
import { click, moveTo } from "../../controlApis/mouseCommands";
import { IPC_FUNCTION_KEYS } from "../../constants/ipcFunctionKeys";

let router = Router();
const { handleUnknownError } = require("../utils");
const MOVEMENT_PATH = "/moveto";
const ACTION_PATH = "/action";

// move mouse to position
router.route(MOVEMENT_PATH).post(async (req, res) => {
  try {
    // console.log("received movement command", req.body);
    if (req.body.x && req.body.y) {
      if (configuration.trackingStatus == TRACKING_STATUS.ON) {
        //TODO create handleMoveRequest, which updates mouse pos queue, move and detects click
        moveTo(req.body);
        //TODO move to client side
        // if (configuration.mouseCommands.leftClick) {
        //   detectHoverToClickGesture();
        // }
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
        // if (
        //   configuration.mouseCommands.leftClick &&
        //   req.body.action == "leftClick"
        // ) {
        //   click("left");
        // }
        if (configuration.mouseCommands.rightClick) {
          click("right");
          //reset to leftclick
          configuration.mouseCommands.rightClick = false;
          console.log(
            "mainWindow.webContents.send",
            mainWindow.webContents.send
          );
          mainWindow.webContents.send(
            IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE,
            configuration
          );
        } else {
          click("left");
        }
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
