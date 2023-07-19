"""
FRAME_WIDTH and FRAME_HEIGHT are the frame dimensions of the image from which 
face is detected. They are used to find the position of the face in terms of 
ratios of x-axis and y-axis 
"""
FRAME_WIDTH = 720
FRAME_HEIGHT = 540
HOVER_TO_CLICK_MIN_POINTS = 25; # number of conservative clustered-together mouse positions required to detect a hover-to-click
# HOVER_TO_CLICK_MIN_POINTS must be less than the max size of stored positions
HOVER_TO_CLICK_DISTANCE_THRESHOLD = 0.0085 # largest possible distance between any two positions in a conservative clustered-together mouse positions for the cluster be considered a hover-to-click
DETECT_POSE = False # whether detect pose
FACE_FREQ = 1 # frequency detecting face. E.g. face_freq = 30, detect face every 30 frames
TEMPLATE_FREQ = 1 # frequency updating template. E.g. face_freq = 3, update template every 3 frames

SCALE_FACTOR_X  = 15
SCALE_FACTOR_Y = 15
