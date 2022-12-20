import { Button } from "@nut-tree/nut-js";
import { lowPassFilter, LPFStream } from "../utils/filters";
import { configuration } from "../config/config";

const { mouse, straightTo } = require("@nut-tree/nut-js");
import {
  MOUSE_SPEED_UPPERBOUND,
  MOUSE_SPEED_LOWERBOUND,
  HOVER_TO_CLICK_MIN_POINTS,
  HOVER_TO_CLICK_DISTANCE_THRESHOLD,
} from "../config/mouseConfigs";

const smoothingFactor = 0.3;
const lPFStreamX = new LPFStream(15, smoothingFactor);
const lPFStreamY = new LPFStream(15, smoothingFactor);

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
  // TODO link speedMultiplier to mouseSpeed
  const speedMultiplier = 10000;
  return easeOutQuint(progressPercentage) * speedMultiplier;
}

// const smoothArray = function (values: number[]) {
//   var value = values[0];
//   for (var i = 1; i < values.length; i++) {
//     var currentValue = values[i];
//     value += (currentValue - value) * 0.5;
//     values[i] = Math.round(value);
//   }
//   return values;
// };

async function moveTo(position: { x: number; y: number }) {
  applyScaleFactor(position);
  position.x = position.x * configuration.screenWidth;
  position.y = position.y * configuration.screenHeight;

  configuration.mousePositionSequence.push(position);
  //Apply simple smoothing
  if (configuration.mousePositionSequence.length == 15) {
    lPFStreamX.init(configuration.mousePositionSequence.map((p) => p.x));
    lPFStreamY.init(configuration.mousePositionSequence.map((p) => p.y));
  } else if (configuration.mousePositionSequence.length > 15) {
    position.x = lPFStreamX.next(position.x);
    position.y = lPFStreamY.next(position.y);
  }
  console.log(position.x, ",");

  //show filtered sequence
  // if (configuration.mousePositionSequence.length > 15) {
  //   console.log(
  //     "filter input",
  //     configuration.mousePositionSequence.map((p) => p.x)
  //   );

  //   console.log(
  //     "filter output",
  //     lowPassFilter(
  //       configuration.mousePositionSequence.map((p) => p.x),
  //       100,
  //       30
  //     )
  //   );
  // }

  // TODO apply filter to smoothen movement

  mouse.move(straightTo(position), customEasing);
}

//TODO do not consider last HOVER_TO_CLICK_MIN_POINTS all over again if distance threshold was broken
function detectHoverToClickGesture() {
  if (configuration.mousePositionSequence.length > HOVER_TO_CLICK_MIN_POINTS) {
    const cluster = configuration.mousePositionSequence.slice(
      -HOVER_TO_CLICK_MIN_POINTS
    );
    const longestDistanceX =
      Math.max(...cluster.map((p) => p.x)) -
      Math.min(...cluster.map((p) => p.x));
    const longestDistanceY =
      Math.max(...cluster.map((p) => p.y)) -
      Math.min(...cluster.map((p) => p.y));
    if (
      longestDistanceX < HOVER_TO_CLICK_DISTANCE_THRESHOLD &&
      longestDistanceY < HOVER_TO_CLICK_DISTANCE_THRESHOLD
    ) {
      click("left");
    }
  }
}

async function click(direction: "left" | "right") {
  mouse.click(direction == "left" ? Button.LEFT : Button.RIGHT);
}

export { moveTo, click, setMouseSpeed, detectHoverToClickGesture };
