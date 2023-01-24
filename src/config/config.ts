const enum TRACKING_STATUS {
  OFF,
  ON,
}

const devMode = true;

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
  trackingMode: "position", // valid values => "position",  "joystick", "hybrid"
  joystickStepSize: 30, // how many pixels mouse should move per step when in joystick mode
  mouseMovementScaleFactor: 15, //27,
  mouseMovementScaleFactorY: 17, // 20, //
  screenWidth: 1080, //default val, overwritten with primary screen's size when app starts
  screenHeight: 720,
  mousePositionSequence: [{ x: 0, y: 0 }], // FIF0 queue of past mouse positions. reset everytime trackingStatus is toggled on
  smoothingBufferSize: 200,
  smoothingFactor: 0.3,
};

function updateConfiguration(newConfiguration: typeof configuration) {
  configuration = { ...configuration, ...newConfiguration };
}

export { devMode, configuration, updateConfiguration, TRACKING_STATUS };
