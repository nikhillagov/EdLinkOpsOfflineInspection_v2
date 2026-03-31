/**
 * Electron Preload Script
 * Safe IPC bridge between main and renderer process
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // System
  getVersion: () => ipcRenderer.invoke('system:get-version'),
  getUserDataPath: () => ipcRenderer.invoke('system:get-user-data-path'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  
  // Logging
  log: (level: string, message: string) => 
    ipcRenderer.send('log', { level, message })
});
