from api.requests import getLatestAppSettingsFromServer
from videoProcessing.track2Command import convertFaceTrackingToMouseMovement
from videoProcessing.ssdFaceTrack import getFrameSize, trackFace
from videoProcessing.trackerState import trackerState
import cv2

if __name__ == "__main__":

    # close splash screen
    try:  
        # pyi_splash may not be resolved in some environments.
        import pyi_splash
        # Update the text on the splash screen
        pyi_splash.update_text("App is ready. You can start tracking now.")
        pyi_splash.close()
    except:
        pass

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
        if cv2.getWindowProperty('Face Tracker', cv2.WND_PROP_VISIBLE) < 1:        
            break
        # reset to prevent overflow
        count = 0 if count > 100 else count + 1

    cv2.destroyAllWindows()
