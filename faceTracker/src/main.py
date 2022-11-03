from api.requests import MOUSE_MOVEMENT_PATH, sendRequest
from videoProcessing.track2Command import convertFaceTrackingToMouseMovement, getCenterOfFace
from videoProcessing.ssdFaceTrack import trackFaces
import cv2

if __name__ == "__main__":
    # start webcam 
    # videoStream = cv2.VideoCapture(0)
    while True:
        faces = trackFaces()
        if faces :
            convertFaceTrackingToMouseMovement(faces)
        else:
            ##TO DO: SEND A FAILED TO DETECT REQ
            print("failed to detect a face!")

        # Stop if escape key is pressed
        k = cv2.waitKey(30) & 0xff
        if k == 27:
            break
    # Release the VideoCapture object
    # videoStream.release()