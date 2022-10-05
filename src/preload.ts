// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IPC_FUNCTION_KEYS } from "./constants/ipcFunctionKeys";

contextBridge.exposeInMainWorld("electronAPI", {
  moveMouse: () => ipcRenderer.send(IPC_FUNCTION_KEYS.MOVE_MOUSE),
  openSettings: () => ipcRenderer.send(IPC_FUNCTION_KEYS.OPEN_SETTINGS),
});
