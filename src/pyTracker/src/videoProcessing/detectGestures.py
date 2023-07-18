# USAGE
# python detect_drowsiness.py --shape-predictor shape_predictor_68_face_landmarks.dat
# python detect_drowsiness.py --shape-predictor shape_predictor_68_face_landmarks.dat --alarm alarm.wav

# import the necessary packages
from scipy.spatial import distance as dist
from imutils.video import VideoStream
from imutils import face_utils
from threading import Thread
import numpy as np
import argparse
import imutils
import time
import dlib
import cv2
import os
from api.requests import MOUSE_ACTION_PATH, MOUSE_ACTIONS, MOUSE_MOVEMENT_PATH, sendRequest
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import time
import numpy as np
import matplotlib.pyplot as plt


def mouth_aspect_ratio(mouth):
	# compute the euclidean distances between the two sets of
	# vertical mouth landmarks (x, y)-coordinates
	A = dist.euclidean(mouth[2], mouth[10]) # 51, 59
	B = dist.euclidean(mouth[4], mouth[8]) # 53, 57

	# compute the euclidean distance between the horizontal
	# mouth landmark (x, y)-coordinates
	C = dist.euclidean(mouth[0], mouth[6]) # 49, 55

	# compute the mouth aspect ratio
	mar = (A + B) / (2.0 * C)

	# return the mouth aspect ratio
	return mar

# define one constants, for mouth aspect ratio to indicate open mouth
MOUTH_AR_THRESH = 0.79

# initialize dlib's face detector (HOG-based) and then create
# the facial landmark predictor
print("[INFO] loading facial landmark predictor...")
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(os.path.dirname(os.path.abspath(__file__)) + "/shape_predictor_68_face_landmarks.dat")

# grab the indexes of the facial landmarks for the mouth
(mStart, mEnd) = (49, 68)

time.sleep(1.0)

# Media Pipe Initialization
BaseOptions = mp.tasks.BaseOptions
FaceLandmarker = mp.tasks.vision.FaceLandmarker
FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
FaceLandmarkerResult = mp.tasks.vision.FaceLandmarkerResult
VisionRunningMode = mp.tasks.vision.RunningMode

model_path = os.path.dirname(os.path.abspath(__file__)) + '/face_landmarker.task'
options = FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.IMAGE,
    output_face_blendshapes=True,)


def processEyebrow(result: FaceLandmarkerResult, output_image: mp.Image, timestamp_ms: int):
    # print('face landmarker result: {}'.format(result))
	'''print("Blendshapes exist") if result.face_blendshapes else print(
	    "No blendshapes")'''
	pass
	




def detectEyebrowsRaised(frame):
	
	
	with FaceLandmarker.create_from_options(options) as landmarker:

		mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame)
		timestamp = int(round(time.time()*1000))

		face_landmarker_result = landmarker.detect(mp_image)
		if len(face_landmarker_result.face_blendshapes) > 0:
			landmarks = face_landmarker_result.face_blendshapes[0]

			left_eyebrow_up = landmarks[4]
			right_eyebrow_up = landmarks[5]

			if left_eyebrow_up.score > 0.8 and right_eyebrow_up.score > 0.8:
				sendRequest(MOUSE_ACTION_PATH, MOUSE_ACTIONS.LEFT_CLICK)
	
	return frame

def detectOpenMouth(frame):

	# grab the frame from the threaded video file stream, resize
	# it, and convert it to grayscale
	# channels)
	frame = imutils.resize(frame, width=640)
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

	# detect faces in the grayscale frame
	rects = detector(gray, 0)

	# loop over the face detections
	for rect in rects:
		# determine the facial landmarks for the face region, then
		# convert the facial landmark (x, y)-coordinates to a NumPy
		# array
		shape = predictor(gray, rect)
		shape = face_utils.shape_to_np(shape)

		# extract the mouth coordinates, then use the
		# coordinates to compute the mouth aspect ratio
		mouth = shape[mStart:mEnd]

		mouthMAR = mouth_aspect_ratio(mouth)
		mar = mouthMAR
		# compute the convex hull for the mouth, then
		# visualize the mouth
		#mouthHull = cv2.convexHull(mouth)
		
		'''cv2.drawContours(frame, [mouthHull], -1, (0, 255, 0), 1)
		cv2.putText(frame, "MAR: {:.2f}".format(mar), (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)'''

        # Draw text if mouth is open
		if mar > MOUTH_AR_THRESH:
			'''cv2.putText(frame, "Mouth is Open!", (30,60),
			cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,255),2)'''
			sendRequest(MOUSE_ACTION_PATH, MOUSE_ACTIONS.LEFT_CLICK)
			print("Mouth is Open!")
	return frame