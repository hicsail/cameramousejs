FRAME_WIDTH = 300
FRAME_HEIGHT = 168
HOVER_TO_CLICK_MIN_POINTS = 25; # number of conservative clustered-together mouse positions required to detect a hover-to-click
# HOVER_TO_CLICK_MIN_POINTS must be less than the max size of stored positions
HOVER_TO_CLICK_DISTANCE_THRESHOLD = 0.0085 # largest possible distance between any two positions in a conservative clustered-together mouse positions for the cluster be considered a hover-to-click
DETECT_POSE = True # whether detect pose
FACE_FREQ = 5 # frequency detecting face. E.g. face_freq = 30, detect face every 30 frames

# SCALE_FACTOR_X  = 15
# SCALE_FACTOR_Y = 12
"""
FRAME_WIDTH and FRAME_HEIGHT are the frame dimensions of the image from which 
face is detected. They are used to find the position of the face in terms of 
ratios of x-axis and y-axis 
"""