import { BrowserWindow } from "electron";
import { SCREEN_PATHS } from "../constants/screenPaths";

function openSettings() {
  console.log("opening settings");
  let settingsWindow = new BrowserWindow();
  settingsWindow.loadURL(SCREEN_PATHS.SETTINGS);
  settingsWindow.webContents.openDevTools();
}

export { openSettings };
