import { Router } from "express";
import { mainWindow } from "../../index";
import { configuration, TRACKING_STATUS } from "../../config/config";
import { click, doubleClick, moveMouse } from "../../controlApis/mouseCommands";
import { IPC_FUNCTION_KEYS } from "../../constants/ipcFunctionKeys";

let router = Router();
const { handleUnknownError } = require("../utils");
const MOVEMENT_PATH = "/moveto";
const ACTION_PATH = "/action";

// move mouse to position
router.route(MOVEMENT_PATH).post(async (req, res) => {
  try {
    // console.log("received", req.body);

    if (configuration.trackingStatus == TRACKING_STATUS.ON) {
      moveMouse(req.body);
    }
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
});

// perform mouse click
router.route(ACTION_PATH).post(async (req: any, res: any) => {
  try {
    if (req.body.action) {
      if (configuration.trackingStatus == TRACKING_STATUS.ON) {
        if (configuration.mouseCommands.rightClick) {
          click("right");
          //reset to leftclick
          configuration.mouseCommands.rightClick = false;
          mainWindow.webContents.send(
            IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE,
            configuration
          );
        } else if (configuration.mouseCommands.doubleClick) {
          doubleClick();
          configuration.mouseCommands.doubleClick = false;
          //reset to single leftclick
          mainWindow.webContents.send(
            IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE,
            configuration
          );
        } else {
          click("left");
        }
      }
    }
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
});

export { router };
