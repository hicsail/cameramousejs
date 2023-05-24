# TODO Add type to all method parameters

import requests
from videoProcessing.trackerState import trackerState
import cv2

PORT = 3001
CAMERMOUSE_SERVER_URL = "http://localhost"
MOUSE_MOVEMENT_PATH = "mouse/moveto"
MOUSE_ACTION_PATH = "mouse/action"
SETTINGS_PATH = "mouse/settings"

class MOUSE_ACTIONS:
    LEFT_CLICK = {"action": "leftClick"}
    RIGHT_CLICK = {"action": "rightClick"}

# TODO validate requestPath and request payload compatibility. 
def validateRequestPayload(requestPath, requestData):
    pass

"""
send commands to control mouse, keyboard and settings in Electon CameraMouse app

Examples: 
1. move mouse to new position {x:2, y:4} ie (2/10 of the screen width from the left, 4/10 of the screen height from the top)
    sendRequest(MOUSE_MOVEMENT_PATH, {'x': 2, 'y': 4})
2. left click mouse
    sendRequest(MOUSE_ACTION_PATH, MOUSE_ACTIONS.LEFT_CLICK))

"""
def sendRequest(requestPath, requestData, httpMethod="post"):
    try:
        url = CAMERMOUSE_SERVER_URL+":"+str(PORT)+"/"+requestPath
        if httpMethod=="post":
            response = requests.post(url, json=requestData)
        else:
            response = requests.get(url)
        processShutDownCommand(response)
        return response
    except Exception:
        return None 


def getLatestAppSettingsFromServer():
    response = sendRequest(SETTINGS_PATH, None, httpMethod="get")
    if  response and 'config' in response.json():
        config = response.json()['config']
        trackerState.setScaleFactorValues(config['mouseMovementScaleFactor'], config['mouseMovementScaleFactorY'])


# detect shutdown command from server and end python process immediately
def processShutDownCommand(response):
    try:
      if response and 'status' in response.json() and response.json()['status'] == "shutdown":
        # end python process immediately
        cv2.destroyAllWindows()
        exit(0)
    except Exception:
        return None 
   