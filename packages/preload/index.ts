const electron = require('electron');
//再次暴露electron功能 注意ipcRender是继承自emitter的 但是暴露是浅拷贝 无法拷贝其继承类方法
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
    on: electron.ipcRenderer.on.bind(electron.ipcRenderer),
    removeListener: electron.ipcRenderer.removeListener.bind(electron.ipcRenderer),
    removeAllListeners: electron.ipcRenderer.removeAllListeners.bind(electron.ipcRenderer),
});
