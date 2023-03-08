from videoProcessing.track2Command import convertFaceTrackingToMouseMovement
from videoProcessing.ssdFaceTrack import getFrameSize, trackFace
import cv2

if __name__ == "__main__":
    frameSize = getFrameSize()
    
    while True:
        face, pose, pos = trackFace()
        convertFaceTrackingToMouseMovement(face, frameSize, pose, pos)
        
        # Stop if escape key is pressed
        k = cv2.waitKey(30) & 0xff
        if k == 27:
            break
