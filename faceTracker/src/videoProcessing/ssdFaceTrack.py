from imutils.video import VideoStream
import numpy as np
import argparse
import imutils
import time
import cv2
import os
import sys
import keyboard

#SSD initialization
prototxt = os.path.abspath(os.getcwd())+"/src/videoProcessing/deploy.prototxt.txt"
model = os.path.abspath(os.getcwd())+"/src/videoProcessing/res10_300x300_ssd_iter_140000.caffemodel"
confidenceThreshold = 0.9 #Minimum confidence for an object to be recognized as a face
net = cv2.dnn.readNetFromCaffe(prototxt, model)
vs = VideoStream(src=0).start()
time.sleep(2.0)

def trackFaces():
	# grab the frame from the threaded video stream and resize it
	frame = vs.read()
	frame = imutils.resize(frame, width=400)
	frame= imutils.resize(frame, width=400)
	# grab the frame dimensions and convert it to a blob
	(h, w) = frame.shape[:2]
	blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
		(300, 300), (104.0, 177.0, 123.0))
	# pass the blob through the network and obtain the detections and predictions
	net.setInput(blob)
	detections = net.forward()
	faces = []
	for i in range(0, detections.shape[2]):
	# extract the confidence associated with the prediction
		confidence = detections[0, 0, i, 2]
		# filter out weak detections by ensuring the `confidence` is greater than the minimum confidence
		if confidence < confidenceThreshold:
			continue
		# compute the (x, y)-coordinates of the bounding box for the object
		box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
		(startX, startY, endX, endY) = box.astype("int")
		face = (startX, startY, endX, endY)
		faces.append(face)
		# draw the bounding box of the face along with the associated probability
		text = "{:.2f}%".format(confidence * 100)
		y = startY - 10 if startY - 10 > 10 else startY + 10
		cv2.rectangle(frame, (startX, startY), (endX, endY),
			(0, 0, 255), 2)
		cv2.putText(frame, text, (startX, y),
			cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
		cv2.imshow("Frame", frame)
	return faces

def trackFace():
	##TO DO: Select the closest face to the camera
    faces = trackFaces()
    return faces