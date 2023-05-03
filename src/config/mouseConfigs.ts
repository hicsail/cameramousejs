/**
 * Specifies mouse configuration. Speed, available commands
 */
const MOUSE_SPEED_UPPERBOUND = 14000;
const MOUSE_SPEED_LOWERBOUND = 7000;
const SCALE_FACTOR_X_LOWERBOUND = 7;
const SCALE_FACTOR_X_UPPERBOUND = 25;
const SCALE_FACTOR_Y_LOWERBOUND = 10;
const SCALE_FACTOR_Y_UPPERBOUND = 20;
const PITCH_LOWERBOUND = 3;
const PITCH_UPPERBOUND = 8;
const YAW_LOWERBOUND = 5;
const YAW_UPPERBOUND = 15;
const HOVER_TO_CLICK_MIN_POINTS = 15; //number of conservative clustered-together mouse positions required to detect a hover-to-click
const HOVER_TO_CLICK_DISTANCE_THRESHOLD = 20; //largest possible distance between any two positions in a conservative clustered-together mouse positions for the cluster be considered a hover-to-click

export {
  MOUSE_SPEED_UPPERBOUND,
  MOUSE_SPEED_LOWERBOUND,
  SCALE_FACTOR_X_LOWERBOUND,
  SCALE_FACTOR_X_UPPERBOUND,
  SCALE_FACTOR_Y_LOWERBOUND,
  SCALE_FACTOR_Y_UPPERBOUND,
  PITCH_LOWERBOUND,
  PITCH_UPPERBOUND,
  YAW_LOWERBOUND,
  YAW_UPPERBOUND,
  HOVER_TO_CLICK_MIN_POINTS,
  HOVER_TO_CLICK_DISTANCE_THRESHOLD,
};
