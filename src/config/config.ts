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
  trackingStatus: TRACKING_STATUS.OFF,
  mouseMovementScaleFactor: 5, //ranges from 1-10
  mouseMovementScaleFactorY: 5, //
  screenWidth: 1080, //default val, overwritten with primary screen's size when app starts
  screenHeight: 720,
  mousePositionSequence: [{ x: 0, y: 0 }], // must be reset everytime trackingStatus is toggled on
};

function updateConfiguration(newConfiguration: typeof configuration) {
  configuration = { ...configuration, ...newConfiguration };
}
export { devMode, configuration, updateConfiguration, TRACKING_STATUS };
