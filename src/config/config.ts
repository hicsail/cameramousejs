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
const devMode = true;
const configuration = {
  mouseSpeed: 50,
  availableTrackers: {
    thirdParty: true,
    internal: false,
  },
};

export { devMode, configuration };
