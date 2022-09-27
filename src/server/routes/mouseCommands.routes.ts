import { Router } from "express";
import { moveMouse } from "../../controlApis/mouseCommands";

let router = Router();
const { handleUnknownError } = require("../utils");

//health check
router.route("/").get(async (req, res) => {
  try {
    res.send("ok");
  } catch (error) {
    handleUnknownError(res, error);
  }
});

// move mouse to position
router.route("/").post(async (req: any, res: any) => {
  try {
    console.log("received mouseCommands");
    moveMouse();
    res.send({ status: "ok" });
  } catch (error) {
    handleUnknownError(res, error);
  }
});

export { router };
