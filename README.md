# Cameramousejs

An Electron rewrite of CameraMouse app (http://www.cameramouse.org/)

# Description

Includes a server (Electron app) and a client (a python app). The server controls the UI and mouse movements whereas the client does video processing. When started, the app starts a server on port 3000. The client then sends commands to the server to control the mouse.

# App architecture

See app architecture here https://www.figma.com/file/RgboeCOay5qZk3moqGAtgd/CameraMouse

# Install and run

Steps:

1.  Install js packages. run the command below in the root folder

    npm install

2.  install python packages
    cd into src/pyTracker

    a. create venv environment

         python3 -m venv .venv

    b. activate environment

         source .venv/bin/activate

    c. install python packages into virtual environment

         pip install -r requirements.txt

    Note: On windows, install tensorflow instead of tensorflow-macos

3.  modify code to run in dev mode. in dev mode, electron runs a command to start python code
    a. in src/config/config.ts change, set devMode to true

4.  Run project
    in root folder, run

         npm run start

# Packaging

a. Build python exe file with pyinstaller. First, cd into src/pyTracker , activate virtual environment and run

    pyinstaller --onefile --windowed src/main.py

b. Build electron app.

Set devMode to false in src/config/config.ts change, before building electron app.

    npm run make

# Debugging

After modifying python code and building a new executable, you might want to make the sure the new executable works as intended. To ensure the built python executable works fine, modify code to start the executable instead of running python code. To do this, comment out line 123

    pythonExecutablePath = pythonExecutablePathInProd;

in src/index.ts. Also remember to set devMode to false (otherwise, python code will be run instead) in src/config/config.js.

# Permissions

Built cameramouse app requires accessibility permissions to actually move mouse. On mac, go to System Preferences -> Privacy and Security -> Privacy. Check the box next Cameramouse.
