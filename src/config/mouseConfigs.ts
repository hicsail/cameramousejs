/**
 * Specifies mouse configuration. Speed, available commands
 */
const MOUSE_SPEED_UPPERBOUND = 1000;
const MOUSE_SPEED_LOWERBOUND = 200;
const SCALE_FACTOR_LOWERBOUND = 1;
const SCALE_FACTOR_UPPERBOUND = 10;
const SCALE_FACTOR_Y_LOWERBOUND = 1;
const SCALE_FACTOR_Y_UPPERBOUND = 10;
const HOVER_TO_CLICK_MIN_POINTS = 10; //number of conservative clustered-together mouse positions required to detect a hover-to-click
const HOVER_TO_CLICK_DISTANCE_THRESHOLD = 50; //largest possible distance between any two positions in a conservative clustered-together mouse positions for the cluster be considered a hover-to-click

export {
  MOUSE_SPEED_UPPERBOUND,
  MOUSE_SPEED_LOWERBOUND,
  SCALE_FACTOR_LOWERBOUND,
  SCALE_FACTOR_UPPERBOUND,
  SCALE_FACTOR_Y_LOWERBOUND,
  SCALE_FACTOR_Y_UPPERBOUND,
  HOVER_TO_CLICK_MIN_POINTS,
  HOVER_TO_CLICK_DISTANCE_THRESHOLD,
};
