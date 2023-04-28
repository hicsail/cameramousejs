from api.requests import getLatestAppSettingsFromServer
from videoProcessing.track2Command import convertFaceTrackingToMouseMovement
from videoProcessing.ssdFaceTrack import getFrameSize, trackFace
from videoProcessing.trackerState import trackerState

import cv2

if __name__ == "__main__":
    frameSize = getFrameSize()
    trackerState.setWebcamFrameSize(frameSize[0], frameSize[1])
    count = 0
    while True:
        face, pose, pos = trackFace()
        convertFaceTrackingToMouseMovement(face, frameSize, pose, pos)
        
        # get config every now and then
        if count % 20 == 0:
            getLatestAppSettingsFromServer()

        # Stop if escape key is pressed
        k = cv2.waitKey(30) & 0xff
        if k == 27:
            break
        # reset to prevent overflow
        count = 0 if count > 100 else count + 1
