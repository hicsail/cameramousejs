// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IPC_FUNCTION_KEYS } from "./constants/ipcFunctionKeys";

contextBridge.exposeInMainWorld("electronAPI", {
  // moveMouse: () => ipcRenderer.send(IPC_FUNCTION_KEYS.MOVE_MOUSE),
  openSettings: () => ipcRenderer.send(IPC_FUNCTION_KEYS.OPEN_SETTINGS),
  // setMouseSpeed: (mouseSpeed: number) =>
  //   ipcRenderer.send(IPC_FUNCTION_KEYS.DEMO_FUNCTION, mouseSpeed),
  // demoFunction: (input: number) =>
  //   ipcRenderer.send(IPC_FUNCTION_KEYS.DEMO_FUNCTION, input),
  updateConfiguration: (configuration: any) =>
    ipcRenderer.send(IPC_FUNCTION_KEYS.UPDATE_APP_CONFIGURATION, configuration),

  handleConfigurationUpdate: (callback: any) =>
    ipcRenderer.on(IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE, callback),
});
