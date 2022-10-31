import { Button, right } from "@nut-tree/nut-js";

const { mouse, straightTo } = require("@nut-tree/nut-js");
import {
  MOUSE_SPEED_UPPERBOUND,
  MOUSE_SPEED_LOWERBOUND,
} from "../config/mouseConfigs";
/**
 * TODO
 *  - receive settings
 *    - available commands, mouse speed, etc
 *  - create functions for all available commands
 *  -
 */

/**
 * normalize mouseSpeed to fall in range MOUSE_SPEED_LOWERBOUND - MOUSE_SPEED_UPPERBOUND
 * @param mouseSpeed ranges from 1-100
 */
function setMouseSpeed(mouseSpeed: number) {
  const newSpeed =
    MOUSE_SPEED_LOWERBOUND +
    ((MOUSE_SPEED_UPPERBOUND - MOUSE_SPEED_LOWERBOUND) * mouseSpeed) / 100;
  console.log("New mouse speed after normalizing", newSpeed);
  mouse.config.mouseSpeed = newSpeed;
}

async function moveTo(position: { x: number; y: number }) {
  await mouse.move(straightTo(position));
}

async function click(direction: "left" | "right") {
  mouse.click(direction == "left" ? Button.LEFT : Button.RIGHT);
}

async function demoMove(input: number) {
  setMouseSpeed(input);
  await mouse.move(right(100));
}

export { moveTo, click, setMouseSpeed, demoMove };
