/*
 processes video stream and provides mouse commands
 */
const cv = require("@u4/opencv4nodejs");

function processVideo() {
  const rows = 100; // height
  const cols = 100; // width

  // empty Mat
  const emptyMat = new cv.Mat(rows, cols, cv.CV_8UC3);

  // fill the Mat with default value
  const whiteMat = new cv.Mat(rows, cols, cv.CV_8UC1, 255);
  const blueMat = new cv.Mat(rows, cols, cv.CV_8UC3, [255, 0, 0]);
}
export { processVideo };
