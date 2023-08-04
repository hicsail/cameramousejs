from flask import Flask, render_template, Response
import cv2
import sys
import numpy
import os
import signal

from api.requests import getLatestAppSettingsFromServer
from videoProcessing.track2Command import convertFaceTrackingToMouseMovement
from videoProcessing.ssdFaceTrack import getFrameSize, trackFace
from videoProcessing.trackerState import trackerState

app = Flask(__name__)
count = 0

def get_frame():
    global count

    camera_port=0
    camera=cv2.VideoCapture(camera_port) #this makes a web cam object

    while True:
        retval, frame = camera.read()
        im = cv2.flip(frame, 1) # Image that will be processed

        
        # This is where researchers would call their own tracker functions
        face, pose, pos, new_frame = trackFace(frame) # Track face and get new frame


        frameSize = getFrameSize() # Get frame size
        convertFaceTrackingToMouseMovement(face, frameSize, pose, pos) # Convert face tracking data to mouse movement and send 

        cv2.destroyAllWindows() # To make sure that a separate window doesn't open
        
        if count % 20 == 0:
            getLatestAppSettingsFromServer()


        imgencode=cv2.imencode('.jpg',new_frame)[1]
        stringData=imgencode.tostring()

        count = 0 if count > 100 else count + 1

        yield (b'--frame\r\n'
            b'Content-Type: text/plain\r\n\r\n'+stringData+b'\r\n')

    del(camera) #necessary to prevent python kernel from crashing
 
@app.route('/vid')
def vid():
     return Response(get_frame(),mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/kill")
def stopServer():
    os.kill(os.getpid(), signal.SIGINT)

@app.get("/") 
def index(): 
    return "<h1> Server running </h1>"

@app.get("/status")
def status():
    return 200

app.run(host='localhost',port=8000, debug=True, threaded=True)