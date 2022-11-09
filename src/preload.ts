// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IPC_FUNCTION_KEYS } from "./constants/ipcFunctionKeys";

contextBridge.exposeInMainWorld("electronAPI", {
  updateConfiguration: (configuration: any) =>
    ipcRenderer.send(IPC_FUNCTION_KEYS.UPDATE_APP_CONFIGURATION, configuration),

  handleConfigurationUpdate: (callback: any) =>
    ipcRenderer.on(IPC_FUNCTION_KEYS.HANDLE_CONFIGURATION_UPDATE, callback),
});
