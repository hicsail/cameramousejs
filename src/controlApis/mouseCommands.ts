import { Button, down, left, right, up } from "@nut-tree/nut-js";
import { LPFStream } from "../utils/filters";
import { configuration } from "../config/config";
import { positions } from "@mui/system";

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
    return scaledPositionRatio;
  };

  position.x = scale(position.x, configuration.mouseMovementScaleFactor);
  position.y = scale(position.y, configuration.mouseMovementScaleFactorY);
}

// https://easings.net/#easeOutQuint
function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

function customEasing(progressPercentage: number): number {
  const speedMultiplier = 10000; // TODO: test to find best range. there seem to be no difference in perceived mouse speed when number is between 1000 and 100,000.
  return easeOutQuint(progressPercentage) * speedMultiplier;
}

/**
 * takes request from client and converts it into mouse movement, based on the trackMode setting
 * @param request request body from client
 */
function moveMouse(requestBody: {
  x: number;
  y: number;
  yaw?: number;
  pitch?: number;
}) {
  if (configuration.trackingMode == "position") {
    moveTo({ x: requestBody.x, y: requestBody.y });
  } else if (configuration.trackingMode == "joystick") {
    moveByYawAndPitch(requestBody.yaw, requestBody.pitch);
  }
}

/**
 * moves mouse to x,y postion postion on screen given a ration coordinate (eg: x:0.4, y:0.2)
 * @param position ratio coordinate
 */
async function moveTo(position: { x: number; y: number }) {
  applyScaleFactor(position);
  position.x = position.x * configuration.screenWidth;
  position.y = position.y * configuration.screenHeight;

  configuration.mousePositionSequence.push(position);

  // Apply simple smoothing
  if (configuration.mousePositionSequence.length == 15) {
    lPFStreamX.init(configuration.mousePositionSequence.map((p) => p.x));
    lPFStreamY.init(configuration.mousePositionSequence.map((p) => p.y));
  } else if (configuration.mousePositionSequence.length > 15) {
    position.x = lPFStreamX.next(position.x);
    position.y = lPFStreamY.next(position.y);
  }

  mouse.move(straightTo(position), customEasing);
}

async function moveByYawAndPitch(yaw: number, pitch: number) {
  console.log("yaw", yaw, " pitch", pitch);

  const yawThreshold = 17;
  const pitchThreshold = 8;
  yaw < -yawThreshold && (await mouse.move(right(10)));
  yaw > yawThreshold && (await mouse.move(left(10)));
  pitch < -pitchThreshold && (await mouse.move(down(10)));
  pitch > pitchThreshold && (await mouse.move(up(10)));
}

function click(direction: "left" | "right") {
  mouse.click(direction == "left" ? Button.LEFT : Button.RIGHT);
}

function doubleClick() {
  mouse.doubleClick(Button.LEFT);
}

export { moveTo, click, doubleClick, moveMouse };
