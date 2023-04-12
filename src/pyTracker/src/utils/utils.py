# draws the imaginary box used for scaling over the camera feed
from videoProcessing.config.config import FRAME_HEIGHT, FRAME_WIDTH


def drawScalingBox(cvObject, frame):
    templateMatchBoxLength = 11
    boundingBox = getBoundingCoordinatesOfScalingBox()
    # 2 is the width of the boxes (template matching box, scaling box) drawn
    startX = int(boundingBox["x"][0] * FRAME_WIDTH) #- 4
    endX = int(boundingBox["x"][1] * FRAME_WIDTH) #+ templateMatchBoxLength + 4
    startY = int(boundingBox["y"][0] * FRAME_HEIGHT) #- 4
    endY = int(boundingBox["y"][1] * FRAME_HEIGHT) #+ templateMatchBoxLength + 4
    cvObject.rectangle(frame, (startX, startY), (endX, endY),
				(0, 255, 0 ), 2)
    y = startY - 10 if startY - 10 > 10 else startY + 10
    cvObject.putText(frame, "scaling box", (startX, y),
        cvObject.FONT_HERSHEY_SIMPLEX, 0.45, ( 255,0, 0), 2)
  
  
"""
TODO pass scaleFactorX, scaleFactorY
returns the {x:[start,end] , y:[start,end] } 
if scaleFactorX = 1, returns {x:[0,1] , y:[0,1] } 
"""
def getBoundingCoordinatesOfScalingBox():
    # scaleFactorX = 15 => Xs= 0.45 , Xe = 0.55 
    # scaleFactorY = 12 => Ys= 0.458 , Ye = 0.541 
    boundingBox = {"x":[0.45,0.55] , "y":[0.458 ,0.541] }
    return boundingBox
