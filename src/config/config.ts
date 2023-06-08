const enum TRACKING_STATUS {
  OFF,
  ON,
}

const runPythonExeInDevMode = true;

//TODO define appConfiguration interface
var configuration = {
  mouseSpeed: 50,
  availableTrackers: {
    thirdParty: true,
    internal: false,
  },
  mouseCommands: {
    rightClick: false, //when true, the next click command is interpreted as a right click
    doubleClick: false, //when true, the next click command is interpreted as a double click
  },
  trackingStatus: TRACKING_STATUS.OFF,
  trackingMode: "position", // valid values => "position",  "joystick",
  monoTrackingMode: true, //if true, option to switch tracking modes is removed
  trackerLiveness: false, // true only after a command is received from a tracker (client)
  joystickStepSize: 30, // how many pixels mouse should move per step when in joystick mode
  joystickYawThreshold: 9,
  joystickPitchThreshold: 5,
  mouseMovementScaleFactor: 10,
  mouseMovementScaleFactorY: 12,
  screenWidth: 1080, //default val, overwritten with primary screen's size when app starts
  screenHeight: 720,
  mousePositionSequence: [{ x: 0, y: 0 }], // FIF0 queue of past mouse positions. reset everytime trackingStatus is toggled on
  smoothingBufferSize: 2,
  smoothingFactor: 0.5,
  boundaryExclusionPercentage: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  isShuttingDown: false, //used to send shutdown signal to client. when true, all client requests are responded with a command to shutdown
};

function updateConfiguration(newConfiguration: typeof configuration) {
  configuration = newConfiguration;
}

export {
  runPythonExeInDevMode,
  configuration,
  updateConfiguration,
  TRACKING_STATUS,
};
