# TODO Add type to all method parameters

import requests

PORT = 3001
CAMERMOUSE_SERVER_URL = "http://localhost"
MOUSE_MOVEMENT_PATH = "mouse/moveto"
MOUSE_ACTION_PATH = "mouse/action"

class MOUSE_ACTIONS:
    LEFT_CLICK = "leftClick"
    RIGHT_CLICK = "rightClick"

# TODO validate requestPath and request payload compatibility. 
def validateRequestPayload(requestPath, requestData):
    pass

"""
send commands to control mouse, keyboard and settings in Electon CameraMouse app

Examples: 
1. move mouse to new position {x:100, y:200}
    sendRequest(MOUSE_MOVEMENT_PATH, {'x': 100, 'y': 100})
2. left click mouse
    sendRequest(MOUSE_ACTION_PATH, MOUSE_ACTIONS.LEFT_CLICK))

"""
def sendRequest(requestPath, requestData):
    url = CAMERMOUSE_SERVER_URL+":"+str(PORT)+"/"+requestPath
    print("request data", requestData)
    x = requests.post(url, json=requestData)
    if x:
        print("Response from Camera mouse:", x.json())
    else:
        print("No results from camera mouse server. Did you start Cameramouse Electron app?")


