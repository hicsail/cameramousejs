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
  screenWidth: 1080,
  screenHeight: 720,
};

export { devMode, configuration, TRACKING_STATUS };
