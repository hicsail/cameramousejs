from imutils.video import VideoStream
import numpy as np
import imutils
import time
import cv2
import os
from utils.utils import drawScalingBox
from videoProcessing.config import config
from videoProcessing.poseTracker.FSANET_model import *
import dlib
from imutils import face_utils

#SSD initialization
currDirectory = os.path.dirname(os.path.abspath(__file__))
prototxt =  currDirectory + "/deploy.prototxt.txt"
print("prototxt path", prototxt)
model = currDirectory + "/res10_300x300_ssd_iter_140000.caffemodel"
confidenceThreshold = 0.9 #Minimum confidence for an object to be recognized as a face
net = cv2.dnn.readNetFromCaffe(prototxt, model)

# pose tracker
# load model and weights
stage_num = [3,3,3]
num_capsule = 3
dim_capsule = 16
routings = 2
stage_num = [3,3,3]
lambda_d = 1
num_classes = 3
image_size = 64
num_primcaps = 7*3
m_dim = 5
S_set = [num_capsule, dim_capsule, routings, num_primcaps, m_dim]
ad = 0.6
pose_model = FSA_net_Capsule(image_size, num_classes, stage_num, lambda_d, S_set)()
weight_file = currDirectory + "/fsanet_capsule_3_16_2_21_5.h5"
pose_model.load_weights(weight_file)

# parameters for template matching
template_size = 0.03
search_size = 0.5
prev_pos = []
template = []
method = cv2.TM_CCORR_NORMED
dist_threshold = 0.3

# parameters for tracking using optical flow
# parameters for ShiTomasi corner detection
feature_params = dict(maxCorners=100, qualityLevel=0.3, minDistance=7, blockSize=7)
# parameters for Lucas Kanade optical flow
lk_params = dict(
	winSize=(15, 15),
	maxLevel=2,
	criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03),
)
prev_gray = []
p0 = []

# facial landmark detection
landmark_predictor = dlib.shape_predictor(currDirectory + "/shape_predictor_5_face_landmarks.dat")

num_frames = -1
vs = VideoStream(src=0).start()
time.sleep(2.0)

"""
returns the size of the frame on which faces are detected.
Note that config.FRAME_WIDTH and config.FRAME_HEIGHT can't be used directly because the 
final width and heiht of the frame might change depending on the aspect ratio of the camera

for eg: when config.FRAME_WIDTH and config.FRAME_HEIGHT are both 300 and aspect ratio of camera is 1920/1080,
        eventual height of the frame is 168 (not 300) ,after resizing
"""
def getFrameSize():
	frame = vs.read()
	frame = imutils.resize(frame, width=config.FRAME_WIDTH, height=config.FRAME_HEIGHT)
	(h, w) = frame.shape[:2]
	return (w,h)

from math import cos, sin, hypot
def draw_axis(img, yaw, pitch, roll, tdx=None, tdy=None, size = 50):
    pitch = pitch * np.pi / 180
    yaw = -(yaw * np.pi / 180)
    roll = roll * np.pi / 180

    if tdx != None and tdy != None:
        tdx = tdx
        tdy = tdy
    else:
        height, width = img.shape[:2]
        tdx = width / 2
        tdy = height / 2

    # X-Axis pointing to right. drawn in red
    x1 = size * (cos(yaw) * cos(roll)) + tdx
    y1 = size * (cos(pitch) * sin(roll) + cos(roll) * sin(pitch) * sin(yaw)) + tdy

    # Y-Axis | drawn in green
    #        v
    x2 = size * (-cos(yaw) * sin(roll)) + tdx
    y2 = size * (cos(pitch) * cos(roll) - sin(pitch) * sin(yaw) * sin(roll)) + tdy

    # Z-Axis (out of the screen) drawn in blue
    x3 = size * (sin(yaw)) + tdx
    y3 = size * (-cos(yaw) * sin(pitch)) + tdy

    cv2.line(img, (int(tdx), int(tdy)), (int(x1),int(y1)),(0,0,255),3)
    cv2.line(img, (int(tdx), int(tdy)), (int(x2),int(y2)),(0,255,0),3)
    cv2.line(img, (int(tdx), int(tdy)), (int(x3),int(y3)),(255,0,0),2)

    return img

def templateTrack(frame, face):
	# tracking using template matching
	global template, prev_pos, search_size, dist_threshold

	if len(face) > 0:
		rect = dlib.rectangle(left=face[0], top=face[1], 
			right=face[0]+face[2], bottom=face[1]+face[3])
		shape = landmark_predictor(frame, rect)
		shape = face_utils.shape_to_np(shape)
		center = (shape[1] + shape[2]) / 2 # middle of eyes

		if len(template) == 0 or hypot(center[0]-prev_pos[0], center[1]-prev_pos[1]) > dist_threshold * face[2]:
			# initialize with eyes
			(h, w) = frame.shape[:2]
			template = frame[int(center[1]-template_size*h):int(center[1]+template_size*h), 
					int(center[0]-template_size*h):int(center[0]+template_size*h), :]
			prev_pos = [int(center[0]-template_size*h), int(center[1]-template_size*h)]

			# initialize using the center of the face
			# center = (face[0] + face[2] / 2, face[1] + face[3] / 2)
			# template = frame[int(center[1]-template_size*h):int(center[1]+template_size*h), 
			# 			int(center[0]-template_size*h):int(center[0]+template_size*h), :]
			# prev_pos = [int(center[0]-template_size*h), int(center[1]-template_size*h)]

	(th, tw) = template.shape[:2]

	# only search around the previous matching position
	start_y = prev_pos[1]-int(th*search_size)
	start_x = prev_pos[0]-int(tw*search_size)
	end_y = prev_pos[1]+int((1 + 2*search_size)*th)
	end_x = prev_pos[0]+int((1 + 2*search_size)*tw)
	# start_x, start_y, end_x, end_y = face[0], face[1], face[0]+face[2], face[1]+face[3]
	img = frame[start_y:end_y, start_x:end_x, :]

	res = cv2.matchTemplate(img, template, method)
	min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
	# If the method is TM_SQDIFF or TM_SQDIFF_NORMED, take minimum
	if method in [cv2.TM_SQDIFF, cv2.TM_SQDIFF_NORMED]:
		top_left = min_loc
	else:
		top_left = max_loc
	bottom_right = (top_left[0] + tw, top_left[1] + th)
	top_left = (top_left[0] + start_x, top_left[1] + start_y)
	bottom_right = (bottom_right[0] + start_x, bottom_right[1] + start_y)

	# update previous matching position
	prev_pos = top_left
	# update template, use previous best match as the new template
	template = frame[top_left[1]:bottom_right[1], top_left[0]:bottom_right[0], :]

	return top_left, bottom_right

def opticalFlow(frame, face):
	frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	global p0, prev_gray, feature_params, lk_params
	if len(prev_gray) == 0:
		# initialize
		face_mask = np.zeros(frame_gray.shape, dtype=np.uint8)
		face_mask[face[1]:face[1]+face[3], face[0]:face[0]+face[2]] = 1
		p0 = cv2.goodFeaturesToTrack(frame_gray, mask=face_mask, **feature_params)
		prev_gray = frame_gray.copy()
	else:
		# Calculate Optical Flow
		p1, st, err = cv2.calcOpticalFlowPyrLK(
			prev_gray, frame_gray, p0, None, **lk_params
		)
		# Select good points
		good_new = p1[st == 1]
		# good_old = p0[st == 1]

		# Update the previous frame and previous points
		prev_gray = frame_gray.copy()
		p0 = good_new.reshape(-1, 1, 2)

		for new in good_new:
			a, b = new.ravel()
			if face[0] + face[2]/3 <= int(a) <= face[0] + face[2]*2/3 \
				and face[1] + face[3]/3 <= int(b) <= face[1] + face[3]*2/3:
				return new	
	return []


def trackFaces():
	# grab the frame from the threaded video stream and resize it to the global frame size 
	frame = vs.read()
	frame = imutils.resize(frame, width=config.FRAME_WIDTH, height=config.FRAME_HEIGHT)

	# flip image
	frame = cv2.flip(frame, 1)

	# copy frame for traditional tracking
	ori_frame = frame.copy()

	faces = []
	poses = []

	global num_frames
	num_frames += 1
	# detect face every 10 frames
	if num_frames % config.FACE_FREQ == 0:
		# grab the frame dimensions and convert it to a blob
		(h, w) = frame.shape[:2]
		blob = cv2.dnn.blobFromImage(frame, 1.0,
			(300, 300), (104.0, 177.0, 123.0))
		# pass the blob through the network and obtain the detections and predictions
		net.setInput(blob)
		detections = net.forward()

		for i in range(0, detections.shape[2]):
		# extract the confidence associated with the prediction
			confidence = detections[0, 0, i, 2]
			# filter out weak detections by ensuring the `confidence` is greater than the minimum confidence
			if confidence < confidenceThreshold:
				continue

			# compute the (x, y)-coordinates of the bounding box for the object
			box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
			(startX, startY, endX, endY) = box.astype("int")
			face = (startX, startY, endX-startX, endY-startY)
			faces.append(face)

			if config.DETECT_POSE:
				# estimate pose
				x1, y1, x2, y2 = startX, startY, endX, endY
				xw1 = max(int(x1 - ad * face[2]), 0)
				yw1 = max(int(y1 - ad * face[3]), 0)
				xw2 = min(int(x2 + ad * face[2]), w - 1)
				yw2 = min(int(y2 + ad * face[3]), h - 1)
				face_img = cv2.resize(frame[yw1:yw2 + 1, xw1:xw2 + 1, :], (image_size, image_size))
				face_img = cv2.normalize(face_img, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)        
				face_img = np.expand_dims(face_img, axis=0)
				p_result = pose_model.predict(face_img)
				poses.append((p_result[0][0], p_result[0][1], p_result[0][2]))
				# draw pose
				draw_pose_result = draw_axis(frame[yw1:yw2 + 1, xw1:xw2 + 1, :], p_result[0][0], p_result[0][1], p_result[0][2])
				frame[yw1:yw2 + 1, xw1:xw2 + 1, :] = draw_pose_result

			# draw the bounding box of the face along with the associated probability
			text = "{:.2f}%".format(confidence * 100)
			y = startY - 10 if startY - 10 > 10 else startY + 10
			cv2.rectangle(frame, (startX, startY), (endX, endY),
				(0, 0, 255), 2)
			cv2.putText(frame, text, (startX, y),
				cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
	
	pos = []
	# tracking using template matching 
	if faces or len(template) != 0:
		# select the largest face
		sorted_face = sorted(faces, key=lambda x : x[2] * x[3])
		target_face = sorted_face[0] if sorted_face else []
		top_left, bottom_right = templateTrack(ori_frame, target_face)
		# print("template box ", top_left[0] - bottom_right[0])
		cv2.rectangle(frame, top_left, bottom_right, (0, 0, 0), 2)
		pos = top_left

	# tracking using optical flow (not stable)
	# if faces:
	# 	sorted_face = sorted(faces, key=lambda x : x[2] * x[3])
	# 	target_face = sorted_face[0] if sorted_face else []
	# 	pos = opticalFlow(ori_frame, target_face)
	# 	if len(pos) > 0:
	# 		a, b = pos.ravel()
	# 		cv2.circle(frame, (int(a), int(b)), 5, (255, 0, 0), 2)
	# 		pos = (int(a), int(b))
	# 	else:
	# 		pos = [0, 0]

	# tracking with facial landmarks
	# if faces:
	# 	sorted_face = sorted(faces, key=lambda x : x[2] * x[3])
	# 	target_face = sorted_face[0] if sorted_face else []
	# 	rect = dlib.rectangle(left=target_face[0], top=target_face[1], 
	# 		right=target_face[0]+target_face[2], bottom=target_face[1]+target_face[3])
	# 	shape = landmark_predictor(frame, rect)
	# 	shape = face_utils.shape_to_np(shape)
	# 	for (x, y) in shape[-1:]:
	# 		cv2.circle(frame, (x, y), 1, (0, 0, 255), -1)
	# 	pos = shape[-1]
	cv2.imshow("Face Tracker", frame)
	return faces, poses, pos

def trackFace():
	faces, poses, pos = trackFaces()
	if faces:
		if config.DETECT_POSE:
			##TO DO: Select the closest face to the camera
			return faces[0], poses[0], pos
		else:
			return faces[0], [], pos
	else:
		# print("failed to detect a face!")
		return [], [], pos