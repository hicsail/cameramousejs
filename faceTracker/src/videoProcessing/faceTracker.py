import cv2
import os

# returns cordinates of faces in a video stream
def trackFaces(videoStream):
    # Load the cascade
    cascPath = os.path.abspath(os.getcwd())+"/src/videoProcessing/haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascPath)

     # Read the frame
    _, img = videoStream.read()
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Detect the faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    # Draw the rectangle around each face. TODO move out.
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
    # Display
    cv2.imshow('img', img)
    return faces

# Eg face coordinate: [ 910  460   56   56] => [x, y, width, height]
# face coordinates have same height and width so the biggest face by area
# is simply the face with longest width
def chooseBiggestFaceFromTrackedFaces(faces):
    if len(faces) > 0:
        # get face with longest width
        return max(faces, key=lambda f:f[2])
    return []

def trackFace(videoStream):
    faces = trackFaces(videoStream)
    # trackFaces returns multiple coordinates all of which aren't faces. 
    # Assuming the user is facing directly opposite the camera, the coordinate with the largest area is 
    # likeliest to be of the user's face. Therefore, this extra step is useful for improving accuracy of 
    # face detection
    return chooseBiggestFaceFromTrackedFaces(faces)