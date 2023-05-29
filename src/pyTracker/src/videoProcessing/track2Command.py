"""
contains methods that converts tracking data to mouse and keyboard commands
""" 
from collections import deque
import itertools
from api.requests import MOUSE_ACTION_PATH, MOUSE_ACTIONS, MOUSE_MOVEMENT_PATH, sendRequest
from videoProcessing.trackerState import trackerState
from videoProcessing.config import config

NEW_POSITION_THRESHOLD = 0.001 # minimum difference between two consecutive positions required for the latter to be considered a legit new position

def getCenterOfFace(face):
    x, y, w, h = face
    return {'x': x+w/2, 'y': y+h/2}

"""
face : bounding box of face in format (x, y, w, h)
    x: start of box on x axis (left to right)
    y: start of box on y axix (top to bottom)
    w: width of box
    h: height of box
frameSize: (w, h) 
    width and height of the frame in which the face was tracked
"""
def convertFaceTrackingToMouseMovement(face, frameSize, pose, pos, is_blink):
    w, h = frameSize
    if len(pos) > 0:
        newMousePosition = { "x" : pos[0] / w, "y" : pos[1] / h }
        if newMousePosition:
            trackerState.addTrackedPosition(newMousePosition)
            if len(pose) > 0:
                sendRequest(MOUSE_MOVEMENT_PATH, {**newMousePosition , **{"yaw":str(pose[0]), "pitch":str(pose[1])} })  
            else:
                sendRequest(MOUSE_MOVEMENT_PATH, {**newMousePosition , **{"yaw":str(0), "pitch":str(0)} })  
            detectHoverToClickGesture()

"""
sends a left click command to server if face has been hovering around the same position for a while
"""
def detectHoverToClickGesture():
    if len(trackerState.trackedPositions) >= config.HOVER_TO_CLICK_MIN_POINTS: 
        # get last HOVER_TO_CLICK_MIN_POINTS tracked positions.
        startIndex = len(trackerState.trackedPositions) - config.HOVER_TO_CLICK_MIN_POINTS
        endIndex = len(trackerState.trackedPositions)
        cluster = deque(itertools.islice(trackerState.trackedPositions, startIndex, endIndex))# a deque can't be sliced with [x:x]
        # get distance between furthest two points in cluster 
        longestDistanceX = max([p["x"] for p in cluster]) - min([p["x"] for p in cluster] )
        longestDistanceY = max([p["y"] for p in cluster]) - min([p["y"] for p in cluster])

        if longestDistanceX < config.HOVER_TO_CLICK_DISTANCE_THRESHOLD and longestDistanceY < config.HOVER_TO_CLICK_DISTANCE_THRESHOLD:
            # clear past positions to prevent unintentional consecutive clicks
            trackerState.trackedPositions.clear()
            sendRequest(MOUSE_ACTION_PATH, MOUSE_ACTIONS.LEFT_CLICK)
