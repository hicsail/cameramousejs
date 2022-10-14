/**
 * Specified overall app configuration ;
 
available trackers
selected tracker
selected tracker settings
available mouse commands
available keyboard commands
how to begin/end tracking
 * 
 */
const enum TRACKING_STATUS {
  OFF,
  ON,
}
const devMode = true;
var configuration = {
  mouseSpeed: 50,
  availableTrackers: {
    thirdParty: true,
    internal: false,
  },
  trackingStatus: TRACKING_STATUS.OFF,
};

export { devMode, configuration, TRACKING_STATUS };
