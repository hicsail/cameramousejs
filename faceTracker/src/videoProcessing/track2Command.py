# converts tracking data to mouse and keyboard commands
from api.requests import MOUSE_MOVEMENT_PATH, sendRequest

def getCenterOfFace(face):
    x, y, w, h = face
    return {'x': x+w/2, 'y': y+h/2}


def convertFaceTrackingToMouseMovement(face):
    face = face[0]
    newMousePosition = getCenterOfFace(face)
    if newMousePosition:
        sendRequest(MOUSE_MOVEMENT_PATH, newMousePosition)