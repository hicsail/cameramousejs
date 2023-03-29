# TODO Add type to all method parameters

import requests

PORT = 3001
CAMERMOUSE_SERVER_URL = "http://localhost"
MOUSE_MOVEMENT_PATH = "mouse/moveto"
MOUSE_ACTION_PATH = "mouse/action"

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
def sendRequest(requestPath, requestData):
    try:
        url = CAMERMOUSE_SERVER_URL+":"+str(PORT)+"/"+requestPath
        requests.post(url, json=requestData)
    except Exception:
        pass 

