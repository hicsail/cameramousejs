from api.requests import getLatestAppSettingsFromServer
from videoProcessing.track2Command import convertFaceTrackingToMouseMovement
from videoProcessing.ssdFaceTrack import getFrameSize, trackFace
from videoProcessing.trackerState import trackerState
import cv2
from videoProcessing.detectGestures import detectOpenMouth, detectEyebrowsRaised

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

    camera_port=0
    camera=cv2.VideoCapture(camera_port)

    while True:
        retval, frame = camera.read()
        im = cv2.flip(frame, 1) # Image that will be processed

        face, pose, pos = trackFace(frame)
        detectOpenMouth(frame)

        convertFaceTrackingToMouseMovement(face, frameSize, pose, pos)
        
        # get config every now and then
        if count % 20 == 0:
            getLatestAppSettingsFromServer()

        # Stop if escape key is pressed
        k = cv2.waitKey(30) & 0xff
        if k == 27:
            break
        '''if cv2.getWindowProperty('Face Tracker', cv2.WND_PROP_VISIBLE) < 1:        
            break'''
        # reset to prevent overflow
        count = 0 if count > 100 else count + 1

    cv2.destroyAllWindows()
