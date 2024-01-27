import { Router } from "express";
import { mainWindow } from "../../index";
import { configuration, TRACKING_STATUS } from "../../config/config";
import { click, doubleClick, moveMouse, writeTrackingInfo} from "../../controlApis/mouseCommands";
import { IPC_FUNCTION_KEYS } from "../../constants/ipcFunctionKeys";

let router = Router();
const { handleUnknownError } = require("../utils");
const MOVEMENT_PATH = "/moveto";
const ACTION_PATH = "/action";
const SETTINGS_PATH = "/settings";
const LOG_PATH = "/tracking_log";

// get current app configuration
router.route(SETTINGS_PATH).get(async (req, res) => {
  //client (tracker) must request app configuration. therefore, a call to this route is a good test for trackerLiveness
  //turn on liveness
  try {
    if (!configuration.trackerLiveness) {
      configuration.trackerLiveness = true;
      mainWindow.webContents.send(
        IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE,
        configuration
      );
    }
    if (!handleShutDownStatus(res)) {
      res.send(JSON.stringify({ status: "ok" , configuration: configuration}));
    }
  } catch (error) {
    handleUnknownError(res, error);
  }
});

// move mouse to position
router.route(MOVEMENT_PATH).post(async (req, res) => {
  try {
    if (!configuration.trackerLiveness) {
      configuration.trackerLiveness = true;
      mainWindow.webContents.send(
        IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE,
        configuration
      );
    }
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
    const action = req.body.action;
    if (action) {
      if (configuration.trackingStatus == TRACKING_STATUS.ON) {
        if (action == "leftClick") {
          click("left");
        } else if (action == "rightClick") {
          click("right");
        } else if (action == "doubleClick") {
          doubleClick();
        }
      }
    }
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
});

router.route(LOG_PATH).post(async (req: any, res: any) => {
  try {
    const log = req.body;
    
    if (log) {
      writeTrackingInfo(log);
    }
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
}

);

/**
 * detects if app is shutting down and responds with shutdown status
 * @param httpResponse
 */
function handleShutDownStatus(httpResponse: any) {
  if (configuration.isShuttingDown == true) {
    httpResponse.send({ status: "shutdown" });
    return true;
  }
  return false;
}
export { router };
