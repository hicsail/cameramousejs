import { Button, down, left, right, up } from "@nut-tree/nut-js";
import { LPFStream } from "../utils/filters";
import { configuration } from "../config/config";

const { mouse, straightTo } = require("@nut-tree/nut-js");

const lPFStreamX = new LPFStream(
  configuration.smoothingBufferSize,
  configuration.smoothingFactor
);
const lPFStreamY = new LPFStream(
  configuration.smoothingBufferSize,
  configuration.smoothingFactor
);

/**
 * adjust the position ratios based on configuration.mouseMovementScaleFactor
 * helps move mouse across screen with only tiny movements
 *
 * How it works
 * ==============
 * With configuration.mouseMovementScaleFactor, we construct a small box centered at (0.5,0.5)
 *    Eg: the box could be at [(0.4,0.4),(0.6,0.6)] (left-corner right-corner)
 * the position ratios received are projected onto this smaller box. The box, along with the projected postion ratios, is then scaled up
 * to a 1x1 box and the new scaled up position ratios are returned
 * @param position
 */
function applyScaleFactor(position: { x: number; y: number }) {
  const sensitivity = 0.5; //how much configuration.mouseMovementScaleFactor should affect scale. decrease value
  // to make mouse move more with less head movement

  const scale = (positionRatio: number, scaleFactor: number) => {
    var scaledPositionRatio = positionRatio;
    const lowerThreshold = 0.5 - sensitivity / scaleFactor;
    const higherThreshold = 0.5 + sensitivity / scaleFactor;
    const band = higherThreshold - lowerThreshold;

    //cap ratio to 1 and 0 if beyond bounds
    if (positionRatio <= lowerThreshold) {
      scaledPositionRatio = 0;
    } else if (positionRatio >= higherThreshold) {
      scaledPositionRatio = 1;
    } else {
      //if inbetween bound
      if (positionRatio < 0.5) {
        scaledPositionRatio = Math.max(0.5 - (0.5 - positionRatio) / band, 0);
      } else {
        scaledPositionRatio = Math.min((positionRatio - 0.5) / band + 0.5, 1);
      }
    }

    //*********************** */ FOR DEBUGGING scaling
    // if (scaleFactor == configuration.mouseMovementScaleFactorY)
    //   if (scaledPositionRatio == 0) {
    //     console.log("positionRatio: ", positionRatio, "yields 0");
    //   } else {
    //     console.log(
    //       "positionRatio: ",
    //       positionRatio,
    //       "yields ",
    //       scaledPositionRatio
    //     );
    //   }
    // else if (scaledPositionRatio == 0) {
    //   console.log("positionRatio: ", positionRatio, "yields 1");
    // }

    //*********************** */

    return scaledPositionRatio;
  };

  position.x = scale(position.x, configuration.mouseMovementScaleFactor);
  position.y = scale(position.y, configuration.mouseMovementScaleFactorY);
}

/**
 *
 * @param position
 * @returns the position derived after applying simple smoothing to both x and y coordinates
 */
function getNextSmoothPosition(position: { x: number; y: number }) {
  let smoothPosition = { ...position };
  // Apply simple smoothing
  if (configuration.mousePositionSequence.length == 15) {
    lPFStreamX.init(configuration.mousePositionSequence.map((p) => p.x));
    lPFStreamY.init(configuration.mousePositionSequence.map((p) => p.y));
  } else if (configuration.mousePositionSequence.length > 15) {
    smoothPosition.x = lPFStreamX.next(position.x);
    smoothPosition.y = lPFStreamY.next(position.y);
  }
  return smoothPosition;
}

function easeOutQuint(x: number): number {
  // https://easings.net/#easeOutQuint
  return 1 - Math.pow(1 - x, 5);
}

function customEasing(progressPercentage: number): number {
  const speedMultiplier = 10000;
  return easeOutQuint(progressPercentage) * speedMultiplier;
}

/**
 * takes request from client and converts it into mouse movement, based on the trackMode setting
 * @param request request body from client
 */
async function moveMouse(requestBody: {
  x: number;
  y: number;
  yaw?: number;
  pitch?: number;
}) {
  let newPosition: {
    x: number;
    y: number;
  };
  if (configuration.trackingMode == "position") {
    newPosition = await moveByRatioCoordinates({
      x: requestBody.x,
      y: requestBody.y,
    });
  } else if (configuration.trackingMode == "joystick") {
    newPosition = await moveByYawAndPitch(requestBody.yaw, requestBody.pitch);
  }

  configuration.mousePositionSequence.push(newPosition);
}

/**
 * moves mouse to x,y postion postion on screen given a ration coordinate (eg: x:0.4, y:0.2)
 * @param position ratio coordinate
 */
async function moveByRatioCoordinates(position: { x: number; y: number }) {
  applyScaleFactor(position);

  let newPosition = {
    x: position.x * configuration.screenWidth,
    y: position.y * configuration.screenHeight,
  };
  newPosition = getNextSmoothPosition(newPosition);

  mouse.move(straightTo(newPosition), customEasing);
  console.log("newPosition", newPosition);

  return newPosition;
}

/**
 *
 * @param yaw
 * @param pitch
 * @returns the new position
 */
async function moveByYawAndPitch(yaw: number, pitch: number) {
  const joystickStep = configuration.joystickStepSize;
  const yawThreshold = 17;
  const pitchThreshold = 8;
  const lastPosition = configuration.mousePositionSequence.at(-1);

  let newPosition = { ...lastPosition };
  if (yaw < -yawThreshold) {
    await mouse.move(right(joystickStep));
    newPosition.x = newPosition.x + joystickStep;
  } else if (yaw > yawThreshold) {
    await mouse.move(left(joystickStep));
    newPosition.x = newPosition.x - joystickStep;
  }

  if (pitch < -pitchThreshold) {
    await mouse.move(down(joystickStep));
    newPosition.y = newPosition.y - joystickStep;
  } else if (pitch > pitchThreshold) {
    await mouse.move(up(joystickStep));
    newPosition.y = newPosition.y + joystickStep;
  }

  return newPosition;
}

function click(direction: "left" | "right") {
  mouse.click(direction == "left" ? Button.LEFT : Button.RIGHT);
}

function doubleClick() {
  mouse.doubleClick(Button.LEFT);
}

const demoMove = async () => {
  await mouse.move(left(500));
  await mouse.move(up(500));
  await mouse.move(right(500));
  await mouse.move(down(500));
};

export { moveByRatioCoordinates, click, doubleClick, moveMouse, demoMove };
