import { Button, right } from "@nut-tree/nut-js";

const { mouse, straightTo, width, height } = require("@nut-tree/nut-js");
import {
  MOUSE_SPEED_UPPERBOUND,
  MOUSE_SPEED_LOWERBOUND,
} from "../config/mouseConfigs";
import { configuration } from "../config/config";
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

/**
 * adjust the postion ratios based on  configuration.mouseMovementScaleFactor
 * helps move mouse across screen with only tiny movements
 * How it works
 * ==============
 * With configuration.mouseMovementScaleFactor, we construct a small box in the center at (0.5,0.5)
 *    Eg: the box is at [(0.4,0.4),(0.6,0.6)] (left-corner right-corner) when  configuration.mouseMovementScaleFactor is
 * the position ratios received are projected onto this smaller box. The box , along with the projected postion ratios,  is then scaled up
 * to a 1x1 box and the new scaled up position ratios are returned
 * @param position
 */
function applyScaleFactor(position: { x: number; y: number }) {
  const sensitivity = 0.5; //how much configuration.mouseMovementScaleFactor should affect scale. decrease value
  // to make mouse move more with less head movement
  const lowerThreshold =
    0.5 - sensitivity / configuration.mouseMovementScaleFactor;
  const higherThreshold =
    0.5 + sensitivity / configuration.mouseMovementScaleFactor;
  const band = higherThreshold - lowerThreshold;

  //cap ratio to 1 and 0 if beyond bounds
  if (position.x <= lowerThreshold) {
    position.x = 0;
    return;
  } else if (position.x >= higherThreshold) {
    position.x = 1;
    return;
  } else {
    //if inbetween bound
    if (position.x < 0.5) {
      position.x = Math.max(0.5 - (0.5 - position.x) / band, 0);
    } else {
      position.x = Math.min((position.x - 0.5) / band + 0.5, 1);
    }
  }
}

async function moveTo(position: { x: number; y: number }) {
  applyScaleFactor(position);
  position.x = position.x * configuration.screenWidth;
  position.y = Math.min(
    position.y *
      configuration.mouseMovementScaleFactor *
      configuration.screenHeight,
    configuration.screenHeight
  );

  console.log("position", position);

  //TODO figure out how to forcibly terminate previous move command before beginning new one
  mouse.move(straightTo(position));
}

async function click(direction: "left" | "right") {
  mouse.click(direction == "left" ? Button.LEFT : Button.RIGHT);
}

async function demoMove(input: number) {
  setMouseSpeed(input);
  await mouse.move(right(100));
}

export { moveTo, click, setMouseSpeed, demoMove };
