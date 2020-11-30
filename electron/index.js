const {app, BrowserWindow} = require('electron')
const storage = require('electron-json-storage-sync')
const url = require('url')
const path = require('path')

const auth = require('oauth-electron-twitter')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, './../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    win.loadURL(startUrl);


    win.webContents.openDevTools()

    const key = 'wVnEYOs6iGvx77lxYs7n5omi8';
    const secretkey =  'INRQuoOKBN5Oqu4GfbbzDSFeSD8FDf6pb2ggtYHbyAAo8aAkvy';

    const info = {
        key: key,
        secret: secretkey
    }
    const window = new BrowserWindow({webPreferences: {nodeIntegration: false}});
    auth.login(info, window)

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})