const {ipcMain, BrowserWindow} = require("electron")
const auth = require("oauth-electron-twitter")

ipcMain.on("askTwitter", async (event, arg) => {
    const {mainWindow} = arg;
    let info = {
            key: keys.consumer_key,
            secret: keys.consumer_secret
        },
        window = new BrowserWindow({webPreferences: {nodeIntegration: false}});
    auth.login(info, window).then((r) => {
        mainWindow.webContents.send("callBackTwitter", true, r);
        window.close();
    }).catch((err) => {
        mainWindow.webContents.send("error", err, "twitter");
    })
});