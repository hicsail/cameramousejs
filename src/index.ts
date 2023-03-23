import { app, BrowserWindow, ipcMain, Menu, MenuItem, screen } from "electron";
import {
  configuration,
  devMode,
  TRACKING_STATUS,
  updateConfiguration,
} from "./config/config";
import { IPC_FUNCTION_KEYS } from "./constants/ipcFunctionKeys";
import { startServer } from "./server/server";
import * as path from "path";
const { execFile, spawn, exec } = require("node:child_process");
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
const TAG = "index.ts ";
// export var configuration = defaultConfiguration;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
export let mainWindow: BrowserWindow;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  console.log("MAIN_WINDOW_WEBPACK_ENTRY, ", MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (devMode) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
};

const createMenu = (): void => {
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "New Menu",
      submenu: [
        {
          label: "Start tracking",
          accelerator: "Return",
          click: () => {
            console.log("Turned on tracking!");
            configuration.trackingStatus = TRACKING_STATUS.ON;
            configuration.mousePositionSequence = [];
            mainWindow.webContents.send(
              IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE,
              configuration
            );
          },
        },
        {
          label: "Stop tracking",
          accelerator: "Escape",
          click: () => {
            console.log("Turned off tracking!");
            configuration.trackingStatus = TRACKING_STATUS.OFF;
            mainWindow.webContents.send(
              IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE,
              configuration
            );
          },
        },
      ],
    })
  );
  Menu.setApplicationMenu(menu);
};

createMenu();
let pyProc: any = null;

//spawns python tracker as a sub process
function startPyTracker() {
  let pathToPyMain = path.join(__dirname, "../../src/pyTracker/src", "main.py");
  console.log("script path", pathToPyMain);

  //Finds the Contents/Resources folder in macOS .app file
  const pythonExecutablePathInProd = path.join(__dirname, "../../../main");
  let pythonExecutablePath = path.join(
    __dirname,
    "../../src/pyTracker/dist/main"
  );
  let pyProc;
  if (devMode) {
    // run tracker from python code
    console.log("pythonExecutablePath", pythonExecutablePath);
    //note that the name of the virtual environment (.venv) is hardcoded here
    const pathToPyVenv = path.join(
      __dirname,
      "../../src/pyTracker",
      ".venv/bin/python"
    );
    var scriptToExecTracker = pathToPyVenv + " " + pathToPyMain;

    if (process.platform === "win32") {
      // script to start python from code on windows
      const scriptToExecTrackerWindows =
        path.join(
          __dirname,
          "../../src/pyTracker",
          ".venv/Scripts/python.exe"
        ) +
        " " +
        pathToPyMain;
      scriptToExecTracker = scriptToExecTrackerWindows;
    }
    console.log("scriptToExecTracker", scriptToExecTracker);

    pyProc = exec(
      scriptToExecTracker,
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log(" Could not run python code. Error", error);
        }
        console.log("\nstdout", stdout);
        console.log("\nstderr", stderr);
      }
    );
  } else {
    //comment out when running locally (path to py exec file is at a different path in prod vs local)
    pythonExecutablePath = pythonExecutablePathInProd;

    //run tracker from python executable
    pyProc = execFile(
      pythonExecutablePath,

      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log("Could not open python executable. Error ", error);
        }
        console.log("\nstdout", stdout);
        console.log("\nstderr", stderr);
      }
    );
  }

  //TODO log successful tracker exec
  // promisy exec and execFile, await response
}

const exitPyProc = () => {
  pyProc.kill();
  pyProc = null;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  //expose functions to UI
  ipcMain.on(
    IPC_FUNCTION_KEYS.UPDATE_APP_CONFIGURATION,
    (_, newConfiguration: typeof configuration) => {
      updateConfiguration(newConfiguration);
    }
  );
  const primaryDisplay = screen.getPrimaryDisplay();

  const { width, height } = primaryDisplay.workAreaSize;

  configuration.screenWidth = width * primaryDisplay.scaleFactor;
  configuration.screenHeight = height * primaryDisplay.scaleFactor;
  console.log(
    TAG,
    "set screen size to width:",
    configuration.screenWidth,
    "height:",
    configuration.screenHeight
  );

  createWindow();
  startServer();
  startPyTracker();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// close python sub process
app.on("will-quit", exitPyProc);

//required for ts to recognize ipc functions in react code
declare global {
  interface Window {
    electronAPI?: {
      openSettings: () => void;
      handleConfigurationUpdate: (configuration: any) => void;
      updateConfiguration: (configuration: any) => void;
    };
  }
}
