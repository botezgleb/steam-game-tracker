import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  steamAuth: (steamId: string) =>
    ipcRenderer.invoke("auth:steam", steamId),
});
