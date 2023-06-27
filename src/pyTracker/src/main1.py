from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import cv2
from io import StringIO
import io
import imutils
from PIL import Image
import numpy as np

import base64

from api.requests import getLatestAppSettingsFromServer
from videoProcessing.track2Command import convertFaceTrackingToMouseMovement
from videoProcessing.ssdFaceTrack import getFrameSize, trackFace
from videoProcessing.trackerState import trackerState

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins= '*')


@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')

@socketio.on('image')
def image(data_image):
    
    sbuf = StringIO()
    headers, image = data_image.split(',', 1)
    sbuf.write(image)

    # decode and convert into image
    b = io.BytesIO(base64.b64decode(image))
    # print(b)
    pimg = Image.open(b)

    # converting RGB to BGR, as opencv standards
    frame = cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)
    # Process the image frame
    #frame = imutils.resize(frame, width=700)
    #frame = cv2.flip(frame, 1)

    frameSize = getFrameSize()
    trackerState.setWebcamFrameSize(frameSize[0], frameSize[1])
    # print("Starting tracking...")
    face, pose, pos, new_frame = trackFace(frame)
    # print("Converting tracking...")

    convertFaceTrackingToMouseMovement(face, frameSize, pose, pos)

    cv2.destroyAllWindows()
    
    imgencode = cv2.imencode('.jpg', new_frame)[1]

    """ # base64 encode
    stringData = base64.b64encode(imgencode).decode('utf-8')
    b64_src = 'data:image/jpg;base64,'
    stringData = b64_src + stringData

    # emit the frame back
    emit('response_back', stringData) """


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000, debug=True, allow_unsafe_werkzeug=True)
