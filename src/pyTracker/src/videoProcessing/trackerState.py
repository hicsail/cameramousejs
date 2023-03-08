#Record tracking state 
from collections import deque
from videoProcessing.config import config

class TrackerState:
    def __init__(self):
        self.totalReq = 0
        self.trackedReq = 0
        self.trackedProb = 0
        self.trackedPositions = deque() # tracks past N positions to help determine jover to click gesture

    def updateTracked(confidence):
        trackedReq += 1
        trackedProb += confidence
        
    def addTrackedPosition(self, position):
        if len(self.trackedPositions) >  config.HOVER_TO_CLICK_MIN_POINTS:
            self.trackedPositions.popleft()
        self.trackedPositions.append(position)
